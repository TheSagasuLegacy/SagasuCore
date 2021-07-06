import { Episodes } from 'src/series/entities/episodes.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Dialogs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Episodes, { nullable: false, cascade: true })
  owner: Episodes;

  @Column()
  content: string;

  @Column()
  begin: number;

  @Column()
  end: number;

  @Column({ default: null })
  filename?: string;

  @UpdateDateColumn()
  updated: Date;
}
