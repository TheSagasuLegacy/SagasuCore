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
import {
  AccessControlGuard,
  BypassJwtAuthGuard,
  UserAuthGuard,
  UserJwtAuthGuard,
} from './auth/user-auth.guard';
import { UserAuthInterceptor } from './auth/user-auth.interceptor';
import { UserAuthService } from './auth/user-auth.service';
import { AccessTokenDto } from './dto/access-token.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Crud({
  model: { type: User },
  routes: {
    exclude: ['replaceOneBase'],
    getOneBase: {
      decorators: [ApiBearerAuth()],
      interceptors: [UserAuthInterceptor],
    },
  },
  dto: { create: CreateUserDto, update: UpdateUserDto },
  params: { name: { field: 'name', type: 'string', primary: true } },
  query: {
    alwaysPaginate: true,
    maxLimit: 30,
    join: { roles: { eager: true } },
    filter: { allow_login: { $ne: false } },
  },
})
@ApiTags('users')
@Controller('users')
@UseGuards(UserJwtAuthGuard, AccessControlGuard)
export class UsersController implements CrudController<User> {
  constructor(
    public service: UsersService,
    private readonly auth: UserAuthService,
  ) {}

  get base(): CrudController<User> {
    return this;
  }

  @BypassJwtAuthGuard()
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('auth/register')
  async userRegister(@Body() user: CreateUserDto): Promise<User> {
    return this.service.userRegister(user);
  }

  @BypassJwtAuthGuard()
  @UsePipes(new ValidationPipe({ transform: true }))
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
