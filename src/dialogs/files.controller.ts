import { Controller, Get, Param } from '@nestjs/common';
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

  @Get('sha1/:sha1')
  async getBySha1(@Param('sha1') sha1: string) {
    return this.service.getBySha1(sha1);
  }
}
