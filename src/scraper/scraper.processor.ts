import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, JobOptions } from 'bull';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import got from 'got';
import { Episodes } from 'src/series/entities/episodes.entity';
import { Connection } from 'typeorm';
import { Series } from '../series/entities/series.entity';
import {
  SCRAPE_QUEUE,
  SCRAPE_QUEUE_GET,
  SCRAPE_QUEUE_MAIN,
  SCRAPE_QUEUE_PERSIST,
} from './scraper.constants';

interface BangumiData {
  id: number;
  type: number;
  name: string;
  name_cn: string;
  summary: string;
  air_date: string;
  eps: {
    id: number;
    type: number;
    sort: number;
    name: string;
    name_cn: string;
    airdate: string;
  }[];
}

dayjs.extend(customParseFormat);

@Processor(SCRAPE_QUEUE)
export class ScrapeConsumer {
  private logger: Logger = new Logger(ScrapeConsumer.name);

  public jobConfig: JobOptions = {
    removeOnFail: true,
    removeOnComplete: true,
    timeout: 5 * 60 * 1000,
  };

  constructor(private connection: Connection) {}

  @Process({ name: SCRAPE_QUEUE_MAIN })
  async createScrapeTask(job: Job) {
    const { begin, end, workers } = job.data as {
      begin: number;
      end: number;
      workers: number;
    };
    const progress = job.progress() as number | null;
    const total = end - (progress || begin);
    let running = 0;
    let finished = 0;
    for (let current = begin; current <= end; current++) {
      while (running >= workers) {
        await this.sleep(100);
      }
      await job.progress(current);
      running += 1;
      (await job.queue.add(SCRAPE_QUEUE_GET, { page: current }, this.jobConfig))
        .finished()
        .finally(() => {
          running--;
          finished++;
        });
    }
    while (finished < total) {
      await this.sleep(100);
    }
    return;
  }

  @Process(SCRAPE_QUEUE_GET)
  async getBangumiData(job: Job) {
    const { page } = job.data as { page: number };
    const { body } = await got<BangumiData>(
      `https://api.bgm.tv/subject/${page}`,
      {
        http2: true,
        responseType: 'json',
        dnsCache: true,
        searchParams: { responseGroup: 'large' },
        retry: 5,
        timeout: 6000,
        hooks: {
          beforeRetry: [
            (options, error, retry) =>
              this.logger.warn(
                `Network request to "${options.url}" failed: ${error}, retried ${retry} times.`,
              ),
          ],
        },
      },
    );
    this.logger.verbose(`Get page ${page} from bangumi successfully.`);
    if (body.type !== 2) {
      return;
    }
    this.logger.log(`Bangumi ${body.id}-"${body.name}" get finished.`);
    await job.queue.add(SCRAPE_QUEUE_PERSIST, body, this.jobConfig);
    return;
  }

  @Process(SCRAPE_QUEUE_PERSIST)
  async persistBangumiData(job: Job) {
    const data = job.data as BangumiData;
    await this.connection.manager.transaction(async (manager) => {
      const series = manager.create(Series, {
        name: data.name,
        bangumi_id: data.id,
        name_cn: this.utils.string(data.name_cn),
        description: this.utils.string(data.summary),
        air_date: this.utils.date(this.utils.string(data.air_date)),
      });
      await manager.save(series);
      const episodes = data.eps.map((value) =>
        manager.create(Episodes, {
          series: series,
          sort: value.sort,
          type: value.type,
          name: this.utils.string(value.name),
          name_cn: this.utils.string(value.name_cn),
          air_date: this.utils.date(this.utils.string(value.airdate)),
        }),
      );
      await manager.save(episodes);
    });
    this.logger.log(`Bangumi ${data.id}-"${data.name}" persisted.`);
  }

  @OnQueueFailed()
  onError(job: Job, error: Error) {
    this.logger.error(
      `Error occurred during processing job "${job.name}":\n${error.stack}`,
    );
    void job.remove();
  }

  async sleep(ms: number) {
    await new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  private utils = {
    string(value: string): string | null {
      const trimmed = value.trim();
      return trimmed ? trimmed : null;
    },
    date(value: string | null): Date | null {
      const date = dayjs(value, 'YYYY MM DD', 'zh-cn');
      return date.isValid() ? date.toDate() : null;
    },
  };
}
