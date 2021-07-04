import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import got from 'got';
import { Episodes } from 'src/series/entities/episodes.entity';
import { Connection } from 'typeorm';
import { Series } from '../series/entities/series.entity';
import { SCRAPE_QUEUE } from './scraper.constants';

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

@Processor(SCRAPE_QUEUE)
export class ScrapeConsumer {
  private logger: Logger = new Logger(ScrapeConsumer.name);

  constructor(private connection: Connection) {}

  @Process({ name: 'main', concurrency: 1 })
  async createScrapeTask(job: Job) {
    const { begin, end, workers } = job.data as {
      begin: number;
      end: number;
      workers: number;
    };
    let running = 0;
    for (let current = begin; current <= end; current++) {
      await job.progress((current - begin) / (end - begin));
      while (running >= workers) {
        await this.sleep(100);
      }
      running += 1;
      (await job.queue.add('get', { page: current }))
        .finished()
        .finally(() => (running -= 1));
    }
    return;
  }

  @Process('get')
  async getBangumiData(job: Job) {
    const { page } = job.data as { page: number };
    const { body, readableLength } = await got<BangumiData>(
      `https://api.bgm.tv/subject/${page}`,
      {
        http2: true,
        responseType: 'json',
        dnsCache: true,
        searchParams: { responseGroup: 'large' },
      },
    );
    this.logger.log(
      `Bangumi page ${page} get finished, size ${readableLength}.`,
    );
    if (body.type !== 2) {
      return;
    }
    await job.queue.add('persist', body);
    return;
  }

  @Process('persist')
  async persistBangumiData(job: Job) {
    const data = job.data as BangumiData;
    await this.connection.transaction(async (manager) => {
      const series = manager.create(Series, {
        name: data.name,
        name_cn: !!data.name_cn.trim() ? data.name_cn : null,
        description: !!data.summary.trim() ? data.summary : null,
        air_date: !!data.air_date.trim() ? new Date(data.air_date) : null,
      });
      await manager.save(series);
      const episodes = data.eps.map((value) =>
        manager.create(Episodes, {
          series: series,
          name: value.name,
          sort: value.sort,
          name_cn: !!value.name_cn.trim() ? value.name_cn : null,
          air_date: !!value.airdate.trim() ? new Date(value.airdate) : null,
        }),
      );
      await manager.save(episodes);
    });
    this.logger.log(`Bangumi ${data.id}-"${data.name}" persisted.`);
  }

  async sleep(ms: number) {
    await new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
