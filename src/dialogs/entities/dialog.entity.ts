import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { SubtitleFile } from './files.entity';

@Entity()
@Index(['file'])
export class Dialogs extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  begin: number;

  @Column()
  end: number;

  @Column()
  file_id: string;

  @ManyToOne(() => SubtitleFile, (file) => file.dialogs, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'file_id' })
  file: SubtitleFile;

  @Column({ default: null })
  user_id?: number;

  @ManyToOne(() => User, {
    cascade: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @UpdateDateColumn()
  updated: Date;

  @VersionColumn()
  version: number;
}
