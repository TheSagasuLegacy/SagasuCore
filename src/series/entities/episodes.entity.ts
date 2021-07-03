import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Series } from './series.entity';

@Entity()
export class Episodes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Series, (series) => series.episodes)
  series: Series;

  @Column()
  name: string;

  @Column({ default: null })
  sort: number | null;

  @Column({ default: null })
  name_cn: string | null;

  @Column({ default: null })
  air_date: Date | null;
}
