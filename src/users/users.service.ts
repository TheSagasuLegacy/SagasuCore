import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { AppRoles } from 'src/app.roles';
import { Connection, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRoles } from './entities/user-roles.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User) repo: Repository<User>,
    @InjectConnection() private readonly connection: Connection,
  ) {
    super(repo);
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
