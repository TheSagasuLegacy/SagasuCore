import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { SCRAPE_QUEUE, SCRAPE_QUEUE_MAIN } from './scraper.constants';

@Injectable()
export class ScraperService {
  constructor(@InjectQueue(SCRAPE_QUEUE) private queue: Queue) {}

  async startScrape(begin: number, end: number) {
    return this.queue.add(SCRAPE_QUEUE_MAIN, {
      begin: +begin,
      end: +end,
      workers: 8,
    });
  }
}
