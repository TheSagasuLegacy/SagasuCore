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
import { CreateSubtitleFileDto } from './dto/create-file.dto';
import { UpdateSubtitleFileDto } from './dto/update-file.dto';
import { SubtitleFile } from './entities/files.entity';
import { FilesService } from './files.service';

class CreateManyFiles extends CreateMany(CreateSubtitleFileDto) {}

class PaginateFilesResult extends PaginatedResult(SubtitleFile) {}

class PaginateFilesOptions extends PaginationOptions(SubtitleFile) {}

@ApiTags('files')
@Controller('files')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(UserJwtAuthGuard, AccessControlGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class FilesController {
  constructor(public service: FilesService) {}

  @ApiBearerAuth()
  @HasRoles(AppRoles.READ_MULTIPLE_FILE)
  @Get('/')
  getMany(
    @Query() options: PaginateFilesOptions,
  ): Promise<PaginateFilesResult> {
    return this.service.getMany(options);
  }

  @ApiBearerAuth()
  @Get('/:id')
  getOne(@Param('id') id: string) {
    return this.service.getOne(id);
  }

  @ApiBearerAuth()
  @Post('/')
  createOne(@Body() dto: CreateSubtitleFileDto) {
    return this.service.createOne(dto);
  }

  @ApiBearerAuth()
  @Post('/bulk')
  createMany(@Body() dto: CreateManyFiles) {
    return this.service.createMany(dto);
  }

  @ApiBearerAuth()
  @Patch('/:id')
  updateOne(@Param('id') id: string, @Body() dto: UpdateSubtitleFileDto) {
    return this.service.updateOne(id, dto);
  }

  @ApiBearerAuth()
  @Delete('/:id')
  deleteOne(@Param('id') id: string) {
    return this.service.deleteOne(id);
  }

  @ApiBearerAuth()
  @HasRoles(AppRoles.READ_SINGLE_FILE)
  @Get('/sha1/:sha1')
  async getBySha1(@Param('sha1') sha1: string) {
    return this.service.getBySha1(sha1);
  }

  @ApiBearerAuth()
  @HasRoles(AppRoles.READ_MULTIPLE_FILE)
  @Get('/series/:id')
  async getBySeriesId(@Param('id') id: number) {
    return this.service.getBySeriesId(id);
  }
}
