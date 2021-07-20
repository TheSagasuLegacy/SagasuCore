import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import {
  DialogQueueService,
  DialogQueueServiceProcessor,
  QUEUE_NAME as DIALOG_QUEUE_NAME,
} from './dialogs/dialog-queue/dialog-queue.service';
import { DialogsIndexService } from './dialogs/dialogs.service';
import { SeriesIndexService } from './series/series.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        node: config.get<string>('ES_NODE'),
      }),
    }),
    BullModule.registerQueue({
      name: DIALOG_QUEUE_NAME,
      defaultJobOptions: {
        timeout: 5 * 60 * 1000,
        attempts: 3,
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
  ],
  providers: [
    SeriesIndexService,
    DialogsIndexService,
    DialogQueueService,
    DialogQueueServiceProcessor,
  ],
  exports: [ElasticsearchModule, SeriesIndexService],
})
export class ElasticIndexModule {}
