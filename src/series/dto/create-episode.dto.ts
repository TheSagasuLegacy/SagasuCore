import { DeepPartial } from 'typeorm';
import { Episodes, EpisodeType } from '../entities/episodes.entity';

export class CreateEpisodeDto implements DeepPartial<Episodes> {
  series_id: number;

  name: string;

  sort?: number;

  type?: EpisodeType;

  name_cn?: string;

  air_date?: Date;

  user_id?: number;
}
