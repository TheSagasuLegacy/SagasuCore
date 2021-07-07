import { ApiResponse } from '@elastic/elasticsearch';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { SeriesIndexService } from 'src/elastic-index/series/series.service';
import { Repository } from 'typeorm';
import { SeriesSearchResponse } from './dto/search-series.dto';
import { Series } from './entities/series.entity';

interface SearchResponse extends ApiResponse {
  body: {
    took: number;
    timed_out: boolean;
    hits: {
      total: {
        value: number;
        relation: string;
      };
      max_score: number;
      hits: {
        _index: string;
        _type: string;
        _id: string;
        _score: number;
        _source: {
          name: string;
          name_cn?: string;
          description?: string;
        };
        highlight: {
          name?: string[];
          name_cn?: string[];
          description?: string[];
        };
      }[];
    };
  };
}

@Injectable()
export class SeriesSearchService {
  constructor(
    private elastic: SeriesIndexService,
    @InjectRepository(Series) private database: Repository<Series>,
  ) {}

  async search(
    keyword: string,
    fields: ('name' | 'name_cn' | 'description')[],
    from?: number,
    size?: number,
  ) {
    const result = (await this.elastic.search(
      keyword,
      fields,
      from,
      size,
    )) as SearchResponse;
    return plainToClass(SeriesSearchResponse, {
      cost: result.body.took,
      total: result.body.hits.total.value,
      max_score: result.body.hits.max_score,
      results: await Promise.all(
        result.body.hits.hits.map(async (value) => {
          const id = Number.parseFloat(value._id);
          const series = await this.database.findOne(id, {
            loadEagerRelations: false,
          });
          return {
            ...series,
            highlights: value.highlight,
          };
        }),
      ),
    });
  }
}
