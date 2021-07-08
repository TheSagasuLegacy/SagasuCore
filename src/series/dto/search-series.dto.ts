import { OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Max, Min } from 'class-validator';
import { Series } from '../entities/series.entity';

class SeriesSearchInfo extends OmitType(Series, ['episodes'] as const) {}

class SeriesSearchResult {
  info: SeriesSearchInfo;
  search: {
    highlight: {
      name?: string[];
      name_cn?: string[];
      description?: string[];
    };
    score: number;
  };
}

export class SeriesSearchResponse {
  cost: number;
  total: number;
  max_score: number;
  results: SeriesSearchResult[];
}

enum SearchFields {
  Name = 'name',
  ChineseName = 'name_cn',
  Description = 'description',
}

export class SeriesSearchQuery {
  @Type(() => String)
  keyword: string;

  fields?: SearchFields[] = [
    SearchFields.Name,
    SearchFields.ChineseName,
    SearchFields.Description,
  ];

  @Type(() => Number)
  from?: number = 0;

  @Min(0)
  @Max(30)
  @Type(() => Number)
  size?: number = 20;
}
