import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateMany,
  PaginatedResult,
  PaginationOptions,
} from 'src/crud-base.models';
import {
  AccessControlGuard,
  RequireUserLogin,
  UserAuthGuard,
  UserJwtAuthGuard,
} from './auth/user-auth.guard';
import { CurrentUser, UserAuthService } from './auth/user-auth.service';
import { AccessTokenDto } from './dto/access-token.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

class CreateManyUser extends CreateMany(CreateUserDto) {}

class PaginateUserResult extends PaginatedResult(User) {}

class PaginateUserOptions extends PaginationOptions(User) {}

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(UserJwtAuthGuard, AccessControlGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersController {
  constructor(
    public service: UsersService,
    private readonly auth: UserAuthService,
  ) {}

  @ApiBearerAuth()
  @Get('/')
  getMany(@Query() options: PaginateUserOptions): Promise<PaginateUserResult> {
    return this.service.getMany(options);
  }

  @ApiBearerAuth()
  @Get('/:name')
  getOne(@Param('name') name: string) {
    return this.service.getOne(name);
  }

  @ApiBearerAuth()
  @Post('/')
  createOne(@Body() dto: CreateUserDto) {
    return this.service.createOne(dto);
  }

  @ApiBearerAuth()
  @Post('/bulk')
  createMany(@Body() dto: CreateManyUser) {
    return this.service.createMany(dto);
  }

  @ApiBearerAuth()
  @Patch('/:name')
  updateOne(@Param('name') name: string, @Body() dto: UpdateUserDto) {
    return this.service.updateOne(name, dto);
  }

  @ApiBearerAuth()
  @Delete('/:name')
  deleteOne(@Param('name') name: string) {
    return this.service.deleteOne(name);
  }

  @Post('/auth/register')
  async userRegister(@Body() user: CreateUserDto): Promise<User> {
    return this.service.userRegister(user);
  }

  @UseGuards(UserAuthGuard)
  @Post('/auth/login')
  userLogin(
    @CurrentUser() user: User,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() body: LoginUserDto,
  ): AccessTokenDto {
    return this.auth.certificateUser(user);
  }

  @ApiBearerAuth()
  @RequireUserLogin()
  @UseGuards(UserJwtAuthGuard)
  @Get('/auth/profile')
  getProfile(@CurrentUser() user: Express.User): Promise<User> {
    return this.service.getOne(user.name);
  }
}
