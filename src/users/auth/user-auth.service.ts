import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { EntityNotFoundError, Repository } from 'typeorm';
import { AccessTokenDto } from '../dto/access-token.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly jwtService: JwtService,
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
      throw new UnauthorizedException(`account '${account}' does not exist`);
    }
    if (!user.allow_login) {
      throw new UnauthorizedException(`account '${account}' cannot login`);
    }
    if (!(await argon2.verify(user.password, password))) {
      throw new UnauthorizedException(`account '${account}' password invalid`);
    }
    return user;
  }

  certificateUser(user: User): AccessTokenDto {
    const payload = { id: user.id, name: user.name, email: user.email };
    return { token: this.jwtService.sign(payload), payload };
  }
}
