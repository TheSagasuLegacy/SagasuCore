import { Episodes } from 'src/series/entities/episodes.entity';
import { Series } from 'src/series/entities/series.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Dialogs } from './dialog.entity';

@Entity()
@Index(['sha1'], { unique: true })
export class SubtitleFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 1024 })
  filename: string;

  @Column({ length: 40 })
  sha1: string;

  @Column({ default: null })
  remark?: string;

  @ManyToOne(() => Series, { cascade: true, nullable: false })
  series: Series;

  @ManyToOne(() => Episodes, { cascade: true })
  episode?: Episodes;

  @OneToMany(() => Dialogs, (dialog) => dialog.file)
  dialogs: Dialogs[];

  @CreateDateColumn()
  create: Date;
}
