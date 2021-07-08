import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { CreateSubtitleFileDto } from './dto/create-file.dto';
import { UpdateSubtitleFileDto } from './dto/update-file.dto';
import { SubtitleFile } from './entities/files.entity';
import { FilesService } from './files.service';

@Crud({
  model: { type: SubtitleFile },
  dto: { create: CreateSubtitleFileDto, update: UpdateSubtitleFileDto },
  routes: { exclude: ['replaceOneBase'] },
  query: {
    alwaysPaginate: true,
    join: { series: { eager: true }, episode: { eager: true } },
  },
})
@ApiTags('files')
@Controller('files')
export class FilesController implements CrudController<SubtitleFile> {
  constructor(public service: FilesService) {}
}
