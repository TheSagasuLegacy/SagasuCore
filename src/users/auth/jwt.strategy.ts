import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { classToPlain } from 'class-transformer';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User as UserEntity } from '../entities/user.entity';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends UserEntity {}
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

    let user = await this.cache.get<Express.User>(`user-auth:${id}`);
    if (!user) {
      user = await this.repo.findOneOrFail(id);
      await this.cache.set(`user-auth:${id}`, user, { ttl: 2 * 60 });
    }

    return classToPlain<Express.User>(user);
  }
}
