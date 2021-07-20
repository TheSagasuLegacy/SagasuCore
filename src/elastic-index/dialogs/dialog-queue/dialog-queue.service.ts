import {
  InjectQueue,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueStalled,
  Processor,
} from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { Job, Queue } from 'bull';
import { DialogsIndexService } from '../dialogs.service';

export interface DialogData {
  content: string;
  filename: string;
  id: string;
}

export const QUEUE_NAME = 'dialog-queue';

export const CRON_NAME = 'dialog-queue-process-cron';

@Injectable()
export class DialogQueueService {
  constructor(
    @InjectQueue(QUEUE_NAME) public queue: Queue<DialogData>,
    private index: DialogsIndexService,
    private scheduler: SchedulerRegistry,
  ) {}

  get cron() {
    return this.scheduler.getCronJob(CRON_NAME);
  }

  async push(data: DialogData) {
    return this.queue.add(data, { jobId: data.id });
  }

  @Cron('*/15 * * * * *', { name: CRON_NAME })
  async process(size?: number) {
    const jobs = await this.queue.getDelayed(0, size);
    if (jobs.length <= 0) {
      return;
    }
    try {
      const response = await this.index.bulkInsert(jobs.map((job) => job.data));
      jobs.forEach((job) => job.moveToCompleted());
      return response;
    } catch (err) {
      jobs.forEach((job) => job.moveToFailed(err));
    }
  }
}

@Processor(QUEUE_NAME)
export class DialogQueueServiceProcessor {
  logger: Logger = new Logger(DialogQueueServiceProcessor.name);

  @OnQueueActive()
  onActive(job: Job<DialogData>) {
    this.logger.verbose(`${job.data.id} in queue is being processed`);
  }

  @OnQueueFailed()
  onError(job: Job<DialogData>, error: Error) {
    this.logger.warn(`${job.data.id} failed due to error: ${error.message}`);
  }

  @OnQueueStalled()
  onStalled(job: Job<DialogData>) {
    this.logger.debug(`${job.data.id} stalled in queue`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job<DialogData>, result: any) {
    this.logger.verbose(`${job.data.id} finished with result: ${result}`);
  }
}
