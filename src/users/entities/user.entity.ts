import * as argon2 from 'argon2';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  async verifyPassword(password: string): Promise<boolean> {
    return await argon2.verify(this.password, password);
  }

  async setPassword(password: string): Promise<void> {
    this.password = await argon2.hash(password);
  }
}
