import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './auth/jwt.strategy';
import { LocalStrategy } from './auth/local.strategy';
import { UserAuthService } from './auth/user-auth.service';
import { UserRoles } from './entities/user-roles.entity';
import { User } from './entities/user.entity';
import { UserSubscriber } from './entities/user.subscriber';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRoles]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
    }),
    ConfigModule,
  ],
  controllers: [UsersController],
  providers: [
    UserSubscriber,
    UsersService,
    UserAuthService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [TypeOrmModule],
})
export class UsersModule {}
