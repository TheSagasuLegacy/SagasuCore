import { ApiResponse } from '@elastic/elasticsearch';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { DialogsIndexService } from 'src/elastic-index/dialogs/dialogs.service';
import { Repository } from 'typeorm';
import {
  DialogsSearchResponse,
  DialogSuggestResponse,
} from './dto/search-dialog.dto';
import { Dialogs } from './entities/dialog.entity';

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
          content: string;
          id: string;
        };
        highlight: {
          content?: string[];
        };
      }[];
    };
  };
}

interface SearchSuggestResponse extends ApiResponse {
  body: {
    took: number;
    timed_out: boolean;
    suggest: {
      suggest: [
        {
          text: string;
          offset: number;
          length: number;
          options: {
            text: string;
            _id: string;
            _score: number;
          }[];
        },
      ];
    };
  };
}

@Injectable()
export class DialogsSearchService {
  constructor(
    private elastic: DialogsIndexService,
    @InjectRepository(Dialogs) private database: Repository<Dialogs>,
  ) {}

  async search(keyword: string, from?: number, size?: number) {
    const result = (await this.elastic.search(
      keyword,
      from,
      size,
    )) as SearchResponse;
    const response: DialogsSearchResponse = {
      cost: result.body.took,
      total: result.body.hits.total.value,
      max_score: result.body.hits.max_score,
      results: [],
    };
    await Promise.all(
      result.body.hits.hits.map(async (hit) => {
        const result = await this.database.findOne(hit._id, { relations: [] });
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
    return plainToClass(DialogsSearchResponse, response);
  }

  async suggest(keyword: string) {
    const response = (await this.elastic.suggest(
      keyword,
    )) as SearchSuggestResponse;
    const result: DialogSuggestResponse = {
      cost: response.body.took,
      total: response.body.suggest.suggest.length,
      results: response.body.suggest.suggest.map(({ text, options }) => ({
        text,
        score: Math.max(...options.map((option) => option._score)),
      })),
    };
    return plainToClass(DialogSuggestResponse, result);
  }
}
