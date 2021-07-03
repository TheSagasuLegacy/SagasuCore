import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { Episodes } from './entities/episodes.entity';
import { EpisodesService } from './episodes.service';

@Crud({
  model: { type: Episodes },
  dto: { create: CreateEpisodeDto, update: UpdateEpisodeDto },
  routes: { exclude: ['replaceOneBase'] },
  query: { alwaysPaginate: true, join: { series: { eager: true } } },
})
@ApiTags('episodes')
@Controller('episodes')
export class EpisodesController implements CrudController<Episodes> {
  constructor(public service: EpisodesService) {}
}
