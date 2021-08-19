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
import { CreateSeriesDto } from './dto/create-series.dto';
import {
  SeriesSearchQuery,
  SeriesSearchResponse,
} from './dto/search-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { Series } from './entities/series.entity';
import { SeriesSearchService } from './series-search.service';
import { SeriesService } from './series.service';

class CreateManySeries extends CreateMany(CreateSeriesDto) {}

class PaginateSeriesResult extends PaginatedResult(Series) {}

class PaginateSeriesOptions extends PaginationOptions(Series) {}

@ApiTags('series')
@Controller('series')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(UserJwtAuthGuard, AccessControlGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class SeriesController {
  constructor(
    public service: SeriesService,
    public searchService: SeriesSearchService,
  ) {}

  @ApiBearerAuth()
  @HasRoles(AppRoles.READ_MULTIPLE_SERIES)
  @Get('/')
  getMany(
    @Query() options: PaginateSeriesOptions,
  ): Promise<PaginateSeriesResult> {
    return this.service.getMany(options);
  }

  @ApiBearerAuth()
  @Get('/:id')
  getOne(@Param('id') id: number) {
    return this.service.getOne(id);
  }

  @ApiBearerAuth()
  @Post('/')
  createOne(@Body() dto: CreateSeriesDto) {
    return this.service.createOne(dto);
  }

  @ApiBearerAuth()
  @Post('/bulk')
  createMany(@Body() dto: CreateManySeries) {
    return this.service.createMany(dto);
  }

  @ApiBearerAuth()
  @Patch('/:id')
  updateOne(@Param('id') id: number, @Body() dto: UpdateSeriesDto) {
    return this.service.updateOne(id, dto);
  }

  @ApiBearerAuth()
  @Delete('/:id')
  deleteOne(@Param('id') id: number) {
    return this.service.deleteOne(id);
  }

  @ApiBearerAuth()
  @HasRoles(AppRoles.SEARCH_SERIES)
  @Get('search')
  async search(
    @Query() query: SeriesSearchQuery,
  ): Promise<SeriesSearchResponse> {
    const { keyword, fields, from, size } = query;
    return this.searchService.search(keyword, fields, from, size);
  }

  @ApiBearerAuth()
  @HasRoles(AppRoles.READ_SINGLE_SERIES)
  @Get('bgm/:bgmId')
  async getByBgmId(@Param('bgmId') bgmId: number) {
    return this.service.getByBgmId(bgmId);
  }
}
