import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { DialogsService } from './dialogs.service';
import { CreateDialogDto } from './dto/create-dialog.dto';
import { UpdateDialogDto } from './dto/update-dialog.dto';
import { Dialogs } from './entities/dialog.entity';

@Crud({
  model: { type: Dialogs },
  dto: { create: CreateDialogDto, update: UpdateDialogDto },
  routes: { exclude: ['replaceOneBase'] },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
  query: {
    alwaysPaginate: true,
    join: { file: { eager: true } },
    maxLimit: 200,
  },
})
@ApiTags('dialogs')
@Controller('dialogs')
export class DialogsController implements CrudController<Dialogs> {
  constructor(public service: DialogsService) {}

  @Get('file/:id')
  async getByFileId(@Param('id') id: string) {
    return this.service.getByFileId(id);
  }
}
