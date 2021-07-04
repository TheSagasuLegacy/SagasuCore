import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { SeriesModule } from 'src/series/series.module';
import { SCRAPE_QUEUE } from './scraper.constants';
import { ScraperController } from './scraper.controller';
import { ScrapeConsumer } from './scraper.processor';
import { ScraperService } from './scraper.service';

@Module({
  imports: [SeriesModule, BullModule.registerQueue({ name: SCRAPE_QUEUE })],
  controllers: [ScraperController],
  providers: [ScrapeConsumer, ScraperService],
})
export class ScraperModule {}
