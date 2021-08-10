import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { UserAuthGuard, UserJwtAuthGuard } from './auth/user-auth.guard';
import { UserAuthService } from './auth/user-auth.service';
import { AccessTokenDto } from './dto/access-token.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Crud({
  model: { type: User },
  routes: { exclude: ['replaceOneBase'] },
  dto: { create: CreateUserDto, update: UpdateUserDto },
  params: { name: { field: 'name', type: 'string', primary: true } },
  query: {
    alwaysPaginate: true,
    maxLimit: 30,
    join: { roles: { eager: true } },
  },
})
@ApiTags('users')
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService, private auth: UserAuthService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('auth/register')
  async userRegister(@Body() user: CreateUserDto): Promise<User> {
    return this.service.userRegister(user);
  }

  @UseGuards(UserAuthGuard)
  @Post('auth/login')
  userLogin(
    @Request() req: Express.Request,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() body: LoginUserDto,
  ): AccessTokenDto {
    return this.auth.certificateUser(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(UserJwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: Express.Request): User {
    return req.user;
  }
}
