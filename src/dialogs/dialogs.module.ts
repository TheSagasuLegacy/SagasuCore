import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesModule } from 'src/series/series.module';
import { DialogsController } from './dialogs.controller';
import { DialogsService } from './dialogs.service';
import { Dialogs } from './entities/dialog.entity';
import { SubtitleFile } from './entities/files.entity';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [SeriesModule, TypeOrmModule.forFeature([Dialogs, SubtitleFile])],
  controllers: [DialogsController, FilesController],
  providers: [DialogsService, FilesService],
})
export class DialogsModule {}
