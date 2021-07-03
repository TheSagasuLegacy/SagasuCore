import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ default: null })
  episodes: number | null;
}
