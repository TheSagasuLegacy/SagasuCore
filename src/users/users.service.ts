import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AppResources,
  AppRoles,
  BasicRoles,
  GroupedRoles,
} from 'src/app.roles';
import { CrudBaseService } from 'src/crud-base.service';
import { Repository } from 'typeorm';
import { AddRolesDto } from './dto/add-roles.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteRolesDto } from './dto/delete-roles.dto';
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
  constructor(@InjectRepository(User) repo: Repository<User>) {
    super(repo, 'name');
  }

  canCreate(data: { dto: CreateUserDto; user: Express.User }) {
    const { dto, user } = data;
    return dto.name === user.name
      ? this.rolesBuilder.can(user.roles).createOwn(AppResources.USER).granted
      : this.rolesBuilder.can(user.roles).createAny(AppResources.USER).granted;
  }

  canRead(data: { primary?: string; entity?: User; user: Express.User }) {
    const { entity, user } = data;
    return entity?.id === user.id
      ? this.rolesBuilder.can(user.roles).readOwn(AppResources.USER).granted
      : this.rolesBuilder.can(user.roles).readAny(AppResources.USER).granted;
  }

  canUpdate(data: { dto: UpdateUserDto; entity: User; user: Express.User }) {
    const { entity, user } = data;
    return entity.id === user.id
      ? this.rolesBuilder.can(user.roles).updateOwn(AppResources.USER).granted
      : this.rolesBuilder.can(user.roles).updateAny(AppResources.USER).granted;
  }

  canDelete(data: { primary: string; entity: User; user: Express.User }) {
    const { entity, user } = data;
    return entity.id === user.id
      ? this.rolesBuilder.can(user.roles).readOwn(AppResources.USER).granted
      : this.rolesBuilder.can(user.roles).readAny(AppResources.USER).granted;
  }

  async userRegister(user: CreateUserDto) {
    const { id } = await this.repo.manager.connection.transaction(
      async (manager) => {
        const userEntity = manager.merge(User, new User(), user);
        await manager.save(userEntity);
        const roleEntity = manager.merge(UserRoles, new UserRoles(), {
          user: userEntity,
          role: AppRoles.REGISTERED_USER,
        } as UserRoles);
        await manager.save(roleEntity);
        return userEntity;
      },
    );
    return this.repo.findOneOrFail(id);
  }

  getRoles() {
    return Object.fromEntries(
      Object.values(GroupedRoles).map((role) => [
        role,
        this.rolesBuilder
          .getInheritedRolesOf(role)
          .filter((r) => BasicRoles[r]),
      ]),
    );
  }

  async addRoles(dto: AddRolesDto) {
    if (dto.roles.length <= 0)
      throw new BadRequestException('No roles provided');
    const { id } = await this.repo.manager.connection.transaction(
      async (manager) => {
        const user = await this.repo.findOneOrFail(dto.user_id);
        const roleEntities = dto.roles.map((role) =>
          manager.merge(UserRoles, new UserRoles(), {
            user,
            role: role,
          } as UserRoles),
        );
        await manager.save(roleEntities);
        return user;
      },
    );
    return this.repo.findOneOrFail(id);
  }

  async deleteRoles(dto: DeleteRolesDto) {
    if (dto.roles.length <= 0)
      throw new BadRequestException('No roles provided');
    const { id } = await this.repo.manager.connection.transaction(
      async (manager) => {
        const user = await this.repo.findOneOrFail(dto.user_id);
        const roleEntities = await Promise.all(
          dto.roles.map(async (role) => {
            const found = await manager.findOne(UserRoles, {
              where: { user: user.id, role: role },
            });
            if (!found && !dto.ignore_nonexistence) {
              throw new NotFoundException(
                `Role ${role} not found, delete transaction failed`,
              );
            }
            return found;
          }),
        );
        await manager.delete(UserRoles, roleEntities);
        return user;
      },
    );
    return await this.repo.findOneOrFail(id);
  }
}
