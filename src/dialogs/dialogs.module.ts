import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesModule } from 'src/series/series.module';
import { DialogsController } from './dialogs.controller';
import { DialogsService } from './dialogs.service';
import { Dialogs } from './entities/dialog.entity';

@Module({
  imports: [SeriesModule, TypeOrmModule.forFeature([Dialogs])],
  controllers: [DialogsController],
  providers: [DialogsService],
})
export class DialogsModule {}
