import { IQueryInfo } from 'accesscontrol';
import { Action, Possession } from 'accesscontrol/lib/enums';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@Index(['user'])
@Unique(['user', 'resource', 'action', 'possession'])
export class UserRoles implements IQueryInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.roles, {
    nullable: false,
    cascade: true,
  })
  user: User;

  @Column({ default: null })
  role?: string;

  @Column({ default: null })
  resource?: string;

  @Column({ type: 'enum', enum: Action })
  action: keyof typeof Action;

  @Column({ type: 'enum', enum: Possession })
  possession: keyof typeof Possession;
}
