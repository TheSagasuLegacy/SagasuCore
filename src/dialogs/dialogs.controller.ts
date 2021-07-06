import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DialogsService } from './dialogs.service';
import { CreateDialogDto } from './dto/create-dialog.dto';
import { UpdateDialogDto } from './dto/update-dialog.dto';

@Controller('dialogs')
export class DialogsController {
  constructor(private readonly dialogsService: DialogsService) {}

  @Post()
  create(@Body() createDialogDto: CreateDialogDto) {
    return this.dialogsService.create(createDialogDto);
  }

  @Get()
  findAll() {
    return this.dialogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dialogsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDialogDto: UpdateDialogDto) {
    return this.dialogsService.update(+id, updateDialogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dialogsService.remove(+id);
  }
}
