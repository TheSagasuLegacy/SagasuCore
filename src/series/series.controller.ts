import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { SeriesIndexService } from 'src/elastic-index/series/series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { Series } from './entities/series.entity';
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
    public elastic: SeriesIndexService,
  ) {}

  @Get('search')
  async search(@Query('keyword') keyword: string) {
    return this.elastic.search(keyword, ['description', 'name', 'name_cn']);
  }
}
