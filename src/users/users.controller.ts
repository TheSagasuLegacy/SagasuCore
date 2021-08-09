import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
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
  query: { alwaysPaginate: true, maxLimit: 50 },
})
@ApiTags('users')
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService, private auth: UserAuthService) {}

  @ApiCreatedResponse({ type: AccessTokenDto })
  @UseGuards(UserAuthGuard)
  @Post('auth/login')
  userLogin(@Request() req: Express.Request, @Body() body: LoginUserDto) {
    return this.auth.certificateUser(req.user as User);
  }

  @ApiBearerAuth()
  @UseGuards(UserJwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: Express.Request) {
    return req.user as User;
  }
}
