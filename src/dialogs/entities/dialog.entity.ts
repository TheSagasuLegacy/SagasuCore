import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { SubtitleFile } from './files.entity';

@Entity()
@Index(['file'])
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
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  file: SubtitleFile;

  @UpdateDateColumn()
  updated: Date;

  @VersionColumn()
  version: number;
}
