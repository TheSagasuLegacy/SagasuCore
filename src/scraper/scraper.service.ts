import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { SCRAPE_QUEUE } from './scraper.constants';

@Injectable()
export class ScraperService {
  constructor(@InjectQueue(SCRAPE_QUEUE) private queue: Queue) {}

  async startScrape(begin: number, end: number) {
    return this.queue.add('main', { begin: +begin, end: +end, workers: 8 });
  }
}
