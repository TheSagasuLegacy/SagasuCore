import { Module } from '@nestjs/common';
import { DialogsService } from './dialogs.service';
import { DialogsController } from './dialogs.controller';

@Module({
  controllers: [DialogsController],
  providers: [DialogsService]
})
export class DialogsModule {}
