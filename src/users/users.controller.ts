import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Crud({
  model: { type: User },
  routes: { exclude: ['replaceOneBase'] },
  params: { name: { field: 'name', type: 'string', primary: true } },
  query: { alwaysPaginate: true, maxLimit: 50 },
})
@ApiTags('users')
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService) {}
}
