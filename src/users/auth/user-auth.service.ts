import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { EntityNotFoundError, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async findUserByAccount(account: string): Promise<User | undefined> {
    let result: User | undefined;
    try {
      result = await this.repo.findOneOrFail({ name: account });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        result = await this.repo.findOne({ email: account });
      } else {
        throw err;
      }
    }
    return result;
  }

  async validateUser(account: string, password: string): Promise<User> {
    const user = await this.findUserByAccount(account);
    if (!user) {
      throw new UnauthorizedException(`account ${account} cannot be founded`);
    }
    if (!(await argon2.verify(user.password, password))) {
      throw new UnauthorizedException(`account ${account} password invalid`);
    }
    return user;
  }
}
