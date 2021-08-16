/* eslint-disable @typescript-eslint/no-inferrable-types */
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { plainToClass } from 'class-transformer';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppRoles } from 'src/app.roles';
import { Repository } from 'typeorm';
import { User as UserEntity } from '../entities/user.entity';

export class RequestUser implements Partial<Omit<UserEntity, 'roles'>> {
  static from(user?: UserEntity): RequestUser {
    if (user) {
      return plainToClass(RequestUser, {
        ...user,
        roles: user.roles.map((r) => r.role),
      });
    } else {
      return new RequestUser();
    }
  }

  id: number = 0;

  name: string = 'guest';

  email: string = 'guest@sagasu';

  allow_login: boolean = false;

  created: Date = new Date(0);

  updated: Date = new Date(0);

  roles: (keyof typeof AppRoles)[] = [AppRoles.GUEST];
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends RequestUser {}
  }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity) private readonly repo: Repository<UserEntity>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { id: number }) {
    const { id } = payload;

    let user = await this.cache.get<UserEntity>(`user-auth:${id}`);
    if (!user) {
      user = await this.repo.findOne(id);
      await this.cache.set(`user-auth:${id}`, user, { ttl: 2 * 60 });
    }

    return RequestUser.from(user);
  }
}
