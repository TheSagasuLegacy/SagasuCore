import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Series } from './series.entity';

export enum EpisodeType {
  Main = 0,
  Special = 1,
  Opening = 2,
  Ending = 3,
  Advertising = 4,
  MAD = 5,
  Other = 6,
}

@Entity()
@Index(['series', 'sort', 'type'], { unique: true })
export class Episodes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Series, (series) => series.episodes, {
    nullable: false,
    cascade: true,
  })
  series: Series;

  @Column({ default: null })
  name?: string;

  @Column({ default: null, type: 'float' })
  sort?: number;

  @Column({ default: null, type: 'enum', enum: EpisodeType })
  type?: EpisodeType;

  @Column({ default: null })
  name_cn?: string;

  @Column({ default: null })
  air_date?: Date;

  @UpdateDateColumn({ nullable: true })
  updated?: Date;

  @VersionColumn({ nullable: true })
  version?: number;
}
