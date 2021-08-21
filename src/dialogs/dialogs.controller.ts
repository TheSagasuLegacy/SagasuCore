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
import { DialogsSearchService } from './dialogs-search.service';
import { DialogsService } from './dialogs.service';
import { CreateDialogDto } from './dto/create-dialog.dto';
import { DialogSearchQuery } from './dto/search-dialog.dto';
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
  constructor(
    private readonly service: DialogsService,
    private readonly searchService: DialogsSearchService,
  ) {}

  @ApiBearerAuth()
  @HasRoles(AppRoles.READ_MULTIPLE_DIALOG)
  @Get('/')
  getMany(
    @Query() options: PaginateDialogsOptions,
  ): Promise<PaginateDialogsResult> {
    return this.service.getMany(options);
  }

  @ApiBearerAuth()
  @HasRoles(AppRoles.SEARCH_DIALOG)
  @Get('/search')
  search(@Query() options: DialogSearchQuery) {
    return this.searchService.search(
      options.keyword,
      options.from,
      options.size,
    );
  }

  @ApiBearerAuth()
  @HasRoles(AppRoles.SEARCH_DIALOG)
  @Get('/suggest')
  suggest(@Query('keyword') keyword: string) {
    return this, this.searchService.suggest(keyword);
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
