import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
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

  @Column({ default: null })
  user_id?: number;

  @ManyToOne(() => User, {
    cascade: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(() => Episodes, (episode) => episode.series, { eager: true })
  episodes: Episodes[];

  @UpdateDateColumn({ nullable: true })
  updated?: Date;

  @VersionColumn({ nullable: true })
  version?: number;
}
