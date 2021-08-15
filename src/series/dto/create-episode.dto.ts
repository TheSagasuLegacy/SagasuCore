import { EpisodeType } from '../entities/episodes.entity';

export class CreateEpisodeDto {
  series: number;

  name: string;

  sort?: number;

  type?: EpisodeType;

  name_cn?: string;

  air_date?: Date;

  user_id?: number;
}
