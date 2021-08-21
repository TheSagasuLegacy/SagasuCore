import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsPositive, Max, Min } from 'class-validator';
import { Dialogs } from '../entities/dialog.entity';

class DialogsSearchInfo extends OmitType(Dialogs, ['file', 'user'] as const) {}

class DialogSearchResult {
  info: DialogsSearchInfo;
  search: {
    highlight: {
      content?: string[];
    };
    score: number;
  };
}

class DialogSearchSuggestResult {
  text: string;
  score: number;
}

export class DialogsSearchResponse {
  cost: number;
  total: number;
  max_score: number;
  results: DialogSearchResult[];
}

export class DialogSuggestResponse {
  cost: number;
  total: number;
  results: DialogSearchSuggestResult[];
}

export class DialogSearchQuery {
  @Type(() => String)
  keyword: string;

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
