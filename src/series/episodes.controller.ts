import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Episodes } from './entities/episodes.entity';
import { EpisodesService } from './episodes.service';

@Crud({ model: { type: Episodes } })
@ApiTags('episodes')
@Controller('episodes')
export class EpisodesController implements CrudController<Episodes> {
  constructor(public service: EpisodesService) {}
}
