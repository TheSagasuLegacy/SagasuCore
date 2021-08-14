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
  Request,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateManyDto, PaginationDto } from 'src/crud.service';
import {
  AccessControlGuard,
  BypassJwtAuthGuard,
  UserAuthGuard,
  UserJwtAuthGuard,
} from './auth/user-auth.guard';
import { UserAuthService } from './auth/user-auth.service';
import { AccessTokenDto } from './dto/access-token.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

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
  getMany(@Query() options: PaginationDto) {
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
  createMany(@Body() dto: CreateManyDto<CreateUserDto>) {
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

  @BypassJwtAuthGuard()
  @Post('/auth/register')
  async userRegister(@Body() user: CreateUserDto): Promise<User> {
    return this.service.userRegister(user);
  }

  @BypassJwtAuthGuard()
  @UseGuards(UserAuthGuard)
  @Post('/auth/login')
  userLogin(
    @Request() req: Express.Request,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() body: LoginUserDto,
  ): AccessTokenDto {
    return this.auth.certificateUser(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(UserJwtAuthGuard)
  @Get('/auth/profile')
  getProfile(@Request() req: Express.Request): User {
    return req.user;
  }
}
