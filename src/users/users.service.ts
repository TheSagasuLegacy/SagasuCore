import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppResources, AppRoles } from 'src/app.roles';
import { CrudBaseService } from 'src/crud-base.service';
import { Connection, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRoles } from './entities/user-roles.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends CrudBaseService<
  User,
  string,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @InjectRepository(User) repo: Repository<User>,
    @InjectConnection() private readonly connection: Connection,
    @InjectRolesBuilder() private readonly rolesBuilder: RolesBuilder,
  ) {
    super(repo, 'name');
  }

  canCreate(dto: CreateUserDto, user?: Express.User) {
    return dto.name === user.name
      ? this.rolesBuilder
          .can(user.roles.map((r) => r.role))
          .createOwn(AppResources.USER).granted
      : this.rolesBuilder
          .can(user.roles.map((r) => r.role))
          .createAny(AppResources.USER).granted;
  }

  canRead(name?: string, user?: Express.User) {
    return !!name && name === user.name
      ? this.rolesBuilder
          .can(user.roles.map((r) => r.role))
          .readOwn(AppResources.USER).granted
      : this.rolesBuilder
          .can(user.roles.map((r) => r.role))
          .readAny(AppResources.USER).granted;
  }

  canUpdate(dto: UpdateUserDto, entity: User, user?: Express.User) {
    return entity.id === user.id
      ? this.rolesBuilder
          .can(user.roles.map((r) => r.role))
          .updateOwn(AppResources.USER).granted
      : this.rolesBuilder
          .can(user.roles.map((r) => r.role))
          .updateAny(AppResources.USER).granted;
  }

  canDelete(name: string, user?: Express.User) {
    return name === user.name
      ? this.rolesBuilder
          .can(user.roles.map((r) => r.role))
          .readOwn(AppResources.USER).granted
      : this.rolesBuilder
          .can(user.roles.map((r) => r.role))
          .readAny(AppResources.USER).granted;
  }

  async userRegister(user: CreateUserDto) {
    const { id } = await this.connection.transaction(async (manager) => {
      const userEntity = manager.merge(User, new User(), user);
      await manager.save(userEntity);
      const roleEntity = manager.merge(UserRoles, new UserRoles(), {
        user: userEntity,
        role: AppRoles.REGISTERED_USER,
      } as UserRoles);
      await manager.save(roleEntity);
      return userEntity;
    });
    return this.repo.findOne(id);
  }
}
