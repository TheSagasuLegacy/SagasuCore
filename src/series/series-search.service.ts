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
    const response: SeriesSearchResponse = {
      cost: result.body.took,
      total: result.body.hits.total.value,
      max_score: result.body.hits.max_score,
      results: [],
    };
    await Promise.all(
      result.body.hits.hits.map(async (hit) => {
        const id = parseInt(hit._id);
        const result = await this.database.findOne(id, { relations: [] });
        if (result === undefined) {
          return;
        }
        response.results.push({
          info: result,
          search: { highlight: hit.highlight, score: hit._score },
        });
      }),
    );
    response.results.sort((a, b) => a.search.score - b.search.score).reverse();
    return plainToClass(SeriesSearchResponse, response);
  }
}
