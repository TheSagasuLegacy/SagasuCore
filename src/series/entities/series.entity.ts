import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Episodes } from './episodes.entity';

@Entity()
export class Series {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: null })
  name_cn: string | null;

  @Column({ default: null })
  description: string | null;

  @Column({ default: null })
  air_date: Date | null;

  @OneToMany(() => Episodes, (episode) => episode.series)
  episodes: Episodes[];
}
