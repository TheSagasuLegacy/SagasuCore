import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ACGuard, InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppRoles } from 'src/app.roles';
import { RequestUser } from './jwt.strategy';

// * Support authentication bypass: https://stackoverflow.com/questions/57116789
export const RequireUserLogin = () => SetMetadata('require-login', true);

export const HasRoles = (...roles: (keyof typeof AppRoles)[]) =>
  SetMetadata('has-roles', roles);

@Injectable()
export class UserAuthGuard extends AuthGuard('local') {}

@Injectable()
export class UserJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const requireLogin = this.reflector.getAllAndOverride<boolean>(
      'require-login',
      [context.getHandler(), context.getClass()],
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    context.switchToHttp().getRequest().user = RequestUser.from();
    return !requireLogin || super.canActivate(context);
  }
}

@Injectable()
export class AccessControlGuard extends ACGuard<Express.User> {
  constructor(
    private readonly reflect: Reflector,
    @InjectRolesBuilder() private readonly rolesBuilder: RolesBuilder,
  ) {
    super(reflect, rolesBuilder);
  }

  async getUserRoles(context: ExecutionContext) {
    const user = await this.getUser(context);
    return user?.roles ? user.roles : [AppRoles.GUEST];
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activated = await super.canActivate(context);
    const hasRoles = this.reflect.getAllAndOverride<string[]>('has-roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!activated || !hasRoles) return activated;

    const roles = new Set(
      (await this.getUserRoles(context))
        .map((role) => this.rolesBuilder.getInheritedRolesOf(role))
        .reduce((previous, current) => previous.concat(current)),
    );
    for (const role of hasRoles) if (roles.has(role)) return true;

    return false;
  }
}
