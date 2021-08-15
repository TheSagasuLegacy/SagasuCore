import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ACGuard, InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppRoles } from 'src/app.roles';

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
    const requireLogin = this.reflector.get<boolean>(
      'require-login',
      context.getHandler(),
    );
    return requireLogin ? super.canActivate(context) : true;
  }
}

@Injectable()
export class AccessControlGuard extends ACGuard<Express.User> {
  constructor(
    private readonly reflector_: Reflector,
    @InjectRolesBuilder() protected rolesBuilder: RolesBuilder,
  ) {
    super(reflector_, rolesBuilder);
  }

  async getUserRoles(context: ExecutionContext) {
    const user = await this.getUser(context);
    return !!user ? user.roles.map((role) => role.role) : [AppRoles.GUEST];
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activated = await super.canActivate(context);
    const hasRoles = this.reflector_.get<string[]>(
      'has-roles',
      context.getHandler(),
    );
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
