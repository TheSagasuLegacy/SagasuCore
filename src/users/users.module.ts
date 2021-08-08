import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAuthService } from './auth/user-auth.service';
import { UserRoles } from './entities/user-roles.entity';
import { User } from './entities/user.entity';
import { UserSubscriber } from './entities/user.subscriber';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRoles])],
  controllers: [UsersController],
  providers: [UserSubscriber, UsersService, UserAuthService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
