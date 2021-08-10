import { AppRoles } from 'src/app.roles';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@Index(['user'])
@Index(['user', 'role'], { unique: true })
export class UserRoles {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.roles, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @Column({ type: 'character varying' })
  role: keyof typeof AppRoles;

  @CreateDateColumn()
  granted: Date;

  //TODO: implement a expiry date for roles
}
