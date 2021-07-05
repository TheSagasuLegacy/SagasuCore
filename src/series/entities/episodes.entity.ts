import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Series } from './series.entity';

@Entity()
@Unique(['series', 'name', 'sort'])
@Index(['bangumi_id'], { unique: true })
export class Episodes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Series, (series) => series.episodes, { nullable: false })
  series: Series;

  @Column()
  name: string;

  @Column({ default: null })
  sort?: number;

  @Column({ default: null })
  name_cn?: string;

  @Column({ default: null })
  air_date?: Date;

  @Column({ default: null })
  bangumi_id?: number;
}
