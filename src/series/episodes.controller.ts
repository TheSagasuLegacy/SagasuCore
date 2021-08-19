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
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { Episodes } from './entities/episodes.entity';
import { EpisodesService } from './episodes.service';

class CreateManyEpisodes extends CreateMany(CreateEpisodeDto) {}

class PaginateEpisodesResult extends PaginatedResult(Episodes) {}

class PaginateEpisodesOptions extends PaginationOptions(Episodes) {}

@ApiTags('episodes')
@Controller('episodes')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(UserJwtAuthGuard, AccessControlGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class EpisodesController {
  constructor(public service: EpisodesService) {}

  @ApiBearerAuth()
  @HasRoles(AppRoles.READ_MULTIPLE_EPISODE)
  @Get('/')
  getMany(
    @Query() options: PaginateEpisodesOptions,
  ): Promise<PaginateEpisodesResult> {
    return this.service.getMany(options);
  }

  @ApiBearerAuth()
  @Get('/:id')
  getOne(@Param('id') id: number) {
    return this.service.getOne(id);
  }

  @ApiBearerAuth()
  @Post('/')
  createOne(@Body() dto: CreateEpisodeDto) {
    return this.service.createOne(dto);
  }

  @ApiBearerAuth()
  @Post('/bulk')
  createMany(@Body() dto: CreateManyEpisodes) {
    return this.service.createMany(dto);
  }

  @ApiBearerAuth()
  @Patch('/:id')
  updateOne(@Param('id') id: number, @Body() dto: UpdateEpisodeDto) {
    return this.service.updateOne(id, dto);
  }

  @ApiBearerAuth()
  @Delete('/:id')
  deleteOne(@Param('id') id: number) {
    return this.service.deleteOne(id);
  }
}
