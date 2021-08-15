import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
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
  query: {
    alwaysPaginate: true,
    join: { episodes: { eager: true } },
    maxLimit: 30,
  },
})
@ApiTags('series')
@Controller('series')
export class SeriesController implements CrudController<Series> {
  constructor(
    public service: SeriesService,
    public searchService: SeriesSearchService,
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('search')
  async search(
    @Query() query: SeriesSearchQuery,
  ): Promise<SeriesSearchResponse> {
    const { keyword, fields, from, size } = query;
    return this.searchService.search(keyword, fields, from, size);
  }

  @Get('bgm/:bgmId')
  async getByBgmId(@Param('bgmId') bgmId: number) {
    return this.service.getByBgmId(bgmId);
  }
}
