import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';
import { DeepPartial } from 'typeorm';
import { Episodes, EpisodeType } from '../entities/episodes.entity';

export class CreateEpisodeDto implements DeepPartial<Episodes> {
  series_id: number;

  name: string;

  sort?: number;

  type?: EpisodeType;

  name_cn?: string;

  air_date?: Date;

  @ApiProperty({ required: true })
  @IsPositive()
  user_id?: number;
}
