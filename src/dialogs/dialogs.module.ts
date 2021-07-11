import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DialogsIndexService } from 'src/elastic-index/dialogs/dialogs.service';
import { ElasticIndexModule } from 'src/elastic-index/elastic-index.module';
import { SeriesModule } from 'src/series/series.module';
import { DialogsController } from './dialogs.controller';
import { DialogsService } from './dialogs.service';
import { DialogsSubscriber } from './dialogs.subscriber';
import { Dialogs } from './entities/dialog.entity';
import { SubtitleFile } from './entities/files.entity';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { DialogsSearchService } from './dialogs-search.service';

@Module({
  imports: [
    SeriesModule,
    TypeOrmModule.forFeature([Dialogs, SubtitleFile]),
    ElasticIndexModule,
  ],
  controllers: [DialogsController, FilesController],
  providers: [
    DialogsService,
    DialogsSubscriber,
    FilesService,
    DialogsIndexService,
    DialogsSearchService,
  ],
})
export class DialogsModule {}
