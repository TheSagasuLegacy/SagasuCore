import { Controller, Post, Query } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}
  @Post()
  async beginScrape(@Query('begin') begin: number, @Query('end') end: number) {
    await this.scraperService.startScrape(begin, end);
  }
}
