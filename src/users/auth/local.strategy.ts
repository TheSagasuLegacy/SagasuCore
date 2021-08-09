import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserAuthService } from './user-auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: UserAuthService) {
    super({ usernameField: 'account' });
  }

  async validate(username: string, password: string) {
    return this.authService.validateUser(username, password);
  }
}
