import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches } from 'class-validator';
import { DeepPartial } from 'typeorm';
import { User } from '../entities/user.entity';
import { USER_NAME_REGEX, USER_PASS_REGEX } from '../users.constants';

export class CreateUserDto implements DeepPartial<User> {
  @ApiProperty({ pattern: USER_NAME_REGEX.source })
  @Matches(USER_NAME_REGEX)
  name: string;

  @ApiProperty({ format: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ pattern: USER_PASS_REGEX.source })
  @Matches(USER_PASS_REGEX)
  password: string;

  nick?: string;

  bio?: string;
}
