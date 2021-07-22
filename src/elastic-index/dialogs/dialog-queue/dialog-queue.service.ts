import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { Job, Queue } from 'bull';
import { DialogData, DialogsIndexService } from '../dialogs.service';
import { Future } from './future';

export const QUEUE_NAME = 'dialog-queue';

export const CRON_NAME = 'dialog-queue-process-cron';

@Injectable()
export class DialogQueueService {
  private logger: Logger = new Logger(DialogQueueService.name);
  private futures: Map<
    string,
    { future: Future<DialogData>; job: Job<DialogData> }
  > = new Map();
  private running = false;
  private concurrency = 2048;

  constructor(
    @InjectQueue(QUEUE_NAME) public queue: Queue<DialogData>,
    private index: DialogsIndexService,
    private scheduler: SchedulerRegistry,
  ) {
    queue.process(this.concurrency, async (job, done) => {
      const future = new Future<DialogData>();
      this.futures.set(job.id as string, { future, job });
      await future
        .then((value) => done(null, value))
        .catch((error) => done(error))
        .finally(() => this.futures.delete(job.id as string));
    });
  }

  get cron() {
    return this.scheduler.getCronJob(CRON_NAME);
  }

  async push(data: DialogData) {
    return this.queue.add(data, { jobId: data.id });
  }

  @Cron(CronExpression.EVERY_30_SECONDS, { name: CRON_NAME })
  async process() {
    if (this.running) {
      this.logger.debug('There has been a scheduled task running, skip.');
      return;
    }

    try {
      this.running = true;

      while (true) {
        const waiting = await this.queue.getWaitingCount();
        const jobs = Array.from(this.futures.values()).map((item) => item.job);
        const total = jobs.length + waiting;

        if (total <= 0) {
          this.logger.debug(
            'No job waiting or processing, skip job bulk process',
          );
          return;
        }

        if (jobs.length < Math.min(this.concurrency, total)) {
          await Future.sleep(500);
          continue;
        }

        try {
          const response = await this.index.bulkInsert(
            jobs.map((job) => job.data),
          );
          this.logger.log(
            `${jobs.length}/${total} jobs completed,` +
              ` respond ${JSON.stringify(response)},` +
              ` remain ${waiting} waiting.`,
          );
          jobs.forEach((job) =>
            this.futures.get(job.id as string)?.future.setResult(job.data),
          );
        } catch (err) {
          this.logger.error(err);
          jobs.forEach((job) =>
            this.futures.get(job.id as string)?.future.setError(err),
          );
        }
      }
    } finally {
      this.running = false;
    }
  }
}
