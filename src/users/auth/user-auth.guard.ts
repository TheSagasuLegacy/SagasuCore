import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ACGuard } from 'nest-access-control';
import { AppRoles } from 'src/app.roles';
import { User } from '../entities/user.entity';

export const Guest = {
  id: 0,
  name: 'Guest',
  email: 'guest@sagasu.project',
  password: '',
  allow_login: false,
  created: new Date(0),
  updated: new Date(0),
  roles: [{ id: 0, role: AppRoles.GUEST, granted: new Date(0) }],
} as Partial<User>;

@Injectable()
export class UserAuthGuard extends AuthGuard('local') {}

@Injectable()
export class UserJwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class AccessControlGuard extends ACGuard<Express.User> {
  async getUserRoles(context: ExecutionContext) {
    const user = await this.getUser(context);
    return !!user ? user.roles.map((role) => role.role) : AppRoles.GUEST;
  }
}
