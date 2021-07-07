import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElasticIndexModule } from 'src/elastic-index/elastic-index.module';
import { SeriesIndexService } from 'src/elastic-index/series/series.service';
import { Episodes } from './entities/episodes.entity';
import { Series } from './entities/series.entity';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';
import { SeriesController } from './series.controller';
import { SeriesService } from './series.service';
import { SeriesSubscriber } from './series.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Series, Episodes]), ElasticIndexModule],
  controllers: [SeriesController, EpisodesController],
  providers: [
    SeriesService,
    SeriesSubscriber,
    EpisodesService,
    SeriesIndexService,
  ],
  exports: [TypeOrmModule],
})
export class SeriesModule {}
