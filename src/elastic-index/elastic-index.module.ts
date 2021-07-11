import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
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
  ],
  providers: [SeriesIndexService, DialogsIndexService],
  exports: [ElasticsearchModule, SeriesIndexService],
})
export class ElasticIndexModule {}
