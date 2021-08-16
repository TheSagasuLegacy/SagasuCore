import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsPositive, Max, Min } from 'class-validator';
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

  @ApiProperty({ type: SearchFields, isArray: true })
  @Transform(({ value }) =>
    Array.from(typeof value === 'string' ? [value] : value),
  )
  @IsEnum(SearchFields, { each: true })
  fields: SearchFields[] = [
    SearchFields.Name,
    SearchFields.ChineseName,
    SearchFields.Description,
  ];

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @ApiProperty({ minimum: 0, maximum: 30 * 20, default: 0 })
  @Min(0)
  @Max(30 * 20)
  @Type(() => Number)
  from: number = 0;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @ApiProperty({ minimum: 1, maximum: 30, default: 20 })
  @Max(30)
  @IsPositive()
  @Type(() => Number)
  size: number = 20;
}
