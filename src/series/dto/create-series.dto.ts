import { DeepPartial } from 'typeorm';
import { Series } from '../entities/series.entity';

export class CreateSeriesDto implements DeepPartial<Series> {
  name: string;

  name_cn?: string;

  description?: string;

  air_date?: Date;

  bangumi_id?: number;

  user_id?: number;
}
