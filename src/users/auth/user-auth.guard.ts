import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
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
export class UserAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}
