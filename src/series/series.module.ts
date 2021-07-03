import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episodes } from './entities/episodes.entity';
import { Series } from './entities/series.entity';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';
import { SeriesController } from './series.controller';
import { SeriesService } from './series.service';

@Module({
  imports: [TypeOrmModule.forFeature([Series, Episodes])],
  controllers: [SeriesController, EpisodesController],
  providers: [SeriesService, EpisodesService],
  exports: [TypeOrmModule],
})
export class SeriesModule {}
