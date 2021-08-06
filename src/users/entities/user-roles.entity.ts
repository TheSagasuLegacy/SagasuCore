import { IQueryInfo } from 'accesscontrol';
import { Action, Possession } from 'accesscontrol/lib/enums';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserRoles implements IQueryInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  role?: string;

  @Column({ default: null })
  resource?: string;

  @Column({ type: 'enum', enum: Action })
  action: keyof typeof Action;

  @Column({ type: 'enum', enum: Possession })
  possession: keyof typeof Possession;
}
