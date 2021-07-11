import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { CreateSeriesDto } from './dto/create-series.dto';
import {
  SeriesSearchQuery,
  SeriesSearchResponse,
} from './dto/search-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { Series } from './entities/series.entity';
import { SeriesSearchService } from './series-search.service';
import { SeriesService } from './series.service';

@Crud({
  model: { type: Series },
  dto: { create: CreateSeriesDto, update: UpdateSeriesDto },
  routes: { exclude: ['replaceOneBase'] },
  query: { alwaysPaginate: true, join: { episodes: { eager: true } } },
})
@ApiTags('series')
@Controller('series')
export class SeriesController implements CrudController<Series> {
  constructor(
    public service: SeriesService,
    public searchService: SeriesSearchService,
  ) {}

  @ApiOkResponse({ type: SeriesSearchResponse })
  @Get('search')
  async search(@Query() _: SeriesSearchQuery, @Req() request: Request) {
    const query = plainToClass(SeriesSearchQuery, request.query);
    return this.searchService.search(
      query.keyword,
      typeof query.fields == 'string' ? [query.fields] : query.fields,
      query.from,
      query.size,
    );
  }

  @Get('bgm/:bgmId')
  async getByBgmId(@Param('bgmId') bgmId: number) {
    return this.service.getByBgmId(bgmId);
  }
}
