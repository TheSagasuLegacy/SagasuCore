import { Controller } from '@nestjs/common';
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
  query: {
    alwaysPaginate: true,
    join: { owner: { eager: true }, 'owner.series': { eager: true } },
  },
})
@ApiTags('dialogs')
@Controller('dialogs')
export class DialogsController implements CrudController<Dialogs> {
  constructor(public service: DialogsService) {}
}
