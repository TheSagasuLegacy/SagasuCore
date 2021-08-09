import { IsEmail } from 'class-validator';

export class CreateUserDto {
  name: string;

  @IsEmail()
  email: string;

  password: string;

  allow_login: boolean;

  nick?: string;

  bio?: string;
}
