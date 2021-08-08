import * as argon2 from 'argon2';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  InsertEvent,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  UpdateEvent,
} from 'typeorm';
import { UserRoles } from './user-roles.entity';

@Entity()
@Index(['name'], { unique: true })
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64 })
  name: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @BeforeInsert()
  async passwordInsert(event: InsertEvent<User>) {
    if (event.entity.password) {
      event.entity.password = await argon2.hash(event.entity.password);
    }
  }

  @BeforeUpdate()
  async passwordUpdate(event: UpdateEvent<User>) {
    if (
      typeof event.entity.password === 'string' &&
      !!event.entity.password.trim() &&
      event.entity.password !== event.databaseEntity.password
    ) {
      event.entity.password = await argon2.hash(event.entity.password);
    }
  }

  async verifyPassword(password: string): Promise<boolean> {
    return await argon2.verify(this.password, password);
  }

  @Column({ default: true })
  allow_login: boolean;

  @Column({ default: null })
  nick?: string;

  @Column({ default: null })
  bio?: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @OneToMany(() => UserRoles, (role) => role.user, { eager: true })
  roles: UserRoles[];
}
