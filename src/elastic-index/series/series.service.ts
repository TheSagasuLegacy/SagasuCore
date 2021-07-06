import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SeriesService {
  constructor(private elastic: ElasticsearchService) {}
}
