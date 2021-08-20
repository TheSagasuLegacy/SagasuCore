import { Episodes } from 'src/series/entities/episodes.entity';
import { Series } from 'src/series/entities/series.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Dialogs } from './dialog.entity';

@Entity()
@Index(['sha1'], { unique: true })
@Index(['series'])
export class SubtitleFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 1024 })
  filename: string;

  @Column({ length: 40 })
  sha1: string;

  @Column({ default: null })
  remark?: string;

  @Column()
  series_id: number;

  @ManyToOne(() => Series, { cascade: true, nullable: false })
  @JoinColumn({ name: 'series_id' })
  series: Series;

  @Column({ default: null })
  episode_id?: number;

  @ManyToOne(() => Episodes, { cascade: true })
  @JoinColumn({ name: 'episode_id' })
  episode?: Episodes;

  @OneToMany(() => Dialogs, (dialog) => dialog.file)
  dialogs: Dialogs[];

  @Column({ default: null })
  user_id?: number;

  @ManyToOne(() => User, {
    cascade: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @CreateDateColumn()
  create: Date;
}
