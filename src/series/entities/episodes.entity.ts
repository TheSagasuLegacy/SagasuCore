import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
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

  @Column()
  series_id: number;

  @ManyToOne(() => Series, (series) => series.episodes, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'series_id' })
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

  @Column({ default: null })
  user_id?: number;

  @ManyToOne(() => User, {
    cascade: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @UpdateDateColumn({ nullable: true })
  updated?: Date;

  @VersionColumn({ nullable: true })
  version?: number;
}
