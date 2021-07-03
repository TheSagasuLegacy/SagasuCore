import { Module } from '@nestjs/common';
import { SeriesModule } from 'src/series/series.module';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';

@Module({
  imports: [SeriesModule],
  controllers: [ScraperController],
  providers: [ScraperService],
})
export class ScraperModule {}
