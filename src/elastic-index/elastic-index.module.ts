import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { DialogsService } from './dialogs/dialogs.service';
import { SeriesService } from './series/series.service';

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
  providers: [SeriesService, DialogsService],
  exports: [ElasticIndexModule],
})
export class ElasticIndexModule {}
