import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ACGuard } from 'nest-access-control';
import { AppRoles } from 'src/app.roles';

// * Support authentication bypass: https://stackoverflow.com/questions/57116789
export const BypassJwtAuthGuard = () => SetMetadata('no-auth', true);

@Injectable()
export class UserAuthGuard extends AuthGuard('local') {}

@Injectable()
export class UserJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const noAuth = this.reflector.get<boolean>('no-auth', context.getHandler());
    return noAuth ? true : super.canActivate(context);
  }
}

@Injectable()
export class AccessControlGuard extends ACGuard<Express.User> {
  async getUserRoles(context: ExecutionContext) {
    const user = await this.getUser(context);
    return !!user ? user.roles.map((role) => role.role) : AppRoles.GUEST;
  }
}
