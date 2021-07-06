import { Injectable } from '@nestjs/common';
import { CreateDialogDto } from './dto/create-dialog.dto';
import { UpdateDialogDto } from './dto/update-dialog.dto';

@Injectable()
export class DialogsService {
  create(createDialogDto: CreateDialogDto) {
    return 'This action adds a new dialog';
  }

  findAll() {
    return `This action returns all dialogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dialog`;
  }

  update(id: number, updateDialogDto: UpdateDialogDto) {
    return `This action updates a #${id} dialog`;
  }

  remove(id: number) {
    return `This action removes a #${id} dialog`;
  }
}
