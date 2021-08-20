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
import { AppRoles } from 'src/app.roles';
import {
  CreateMany,
  PaginatedResult,
  PaginationOptions,
} from 'src/crud-base.models';
import {
  AccessControlGuard,
  HasRoles,
  UserJwtAuthGuard,
} from 'src/users/auth/user-auth.guard';
import { DialogsService } from './dialogs.service';
import { CreateDialogDto } from './dto/create-dialog.dto';
import { UpdateDialogDto } from './dto/update-dialog.dto';
import { Dialogs } from './entities/dialog.entity';

class CreateManyDialogs extends CreateMany(CreateDialogDto) {}

class PaginateDialogsResult extends PaginatedResult(Dialogs) {}

class PaginateDialogsOptions extends PaginationOptions(Dialogs) {}

@ApiTags('dialogs')
@Controller('dialogs')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(UserJwtAuthGuard, AccessControlGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class DialogsController {
  constructor(public service: DialogsService) {}

  @ApiBearerAuth()
  @HasRoles(AppRoles.READ_MULTIPLE_DIALOG)
  @Get('/')
  getMany(
    @Query() options: PaginateDialogsOptions,
  ): Promise<PaginateDialogsResult> {
    return this.service.getMany(options);
  }

  @ApiBearerAuth()
  @Get('/:id')
  getOne(@Param('id') id: string) {
    return this.service.getOne(id);
  }

  @ApiBearerAuth()
  @Post('/')
  createOne(@Body() dto: CreateDialogDto) {
    return this.service.createOne(dto);
  }

  @ApiBearerAuth()
  @Post('/bulk')
  createMany(@Body() dto: CreateManyDialogs) {
    return this.service.createMany(dto);
  }

  @ApiBearerAuth()
  @Patch('/:id')
  updateOne(@Param('id') id: string, @Body() dto: UpdateDialogDto) {
    return this.service.updateOne(id, dto);
  }

  @ApiBearerAuth()
  @Delete('/:id')
  deleteOne(@Param('id') id: string) {
    return this.service.deleteOne(id);
  }

  @ApiBearerAuth()
  @Get('file/:id')
  @HasRoles(AppRoles.READ_MULTIPLE_DIALOG)
  async getByFileId(@Param('id') id: string) {
    return this.service.getByFileId(id);
  }
}
