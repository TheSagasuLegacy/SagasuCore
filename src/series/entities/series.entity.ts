import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Episodes } from './episodes.entity';

@Entity()
@Index(['bangumi_id'], { unique: true })
export class Series {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: null })
  name_cn?: string;

  @Column({ default: null })
  description?: string;

  @Column({ default: null })
  air_date?: Date;

  @Column({ default: null })
  bangumi_id?: number;

  @OneToMany(() => Episodes, (episode) => episode.series)
  episodes: Episodes[];
}
