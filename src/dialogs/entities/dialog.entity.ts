import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { SubtitleFile } from './files.entity';

@Entity()
export class Dialogs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  begin: number;

  @Column()
  end: number;

  @ManyToOne(() => SubtitleFile, (file) => file.dialogs, {
    nullable: false,
    cascade: true,
  })
  file: SubtitleFile;

  @UpdateDateColumn()
  updated: Date;

  @VersionColumn()
  version: number;
}
