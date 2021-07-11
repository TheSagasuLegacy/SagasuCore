import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DialogsIndexService } from 'src/elastic-index/dialogs/dialogs.service';
import { Repository } from 'typeorm';
import { Dialogs } from './entities/dialog.entity';

@Injectable()
export class DialogsSearchService {
  constructor(
    private elastic: DialogsIndexService,
    @InjectRepository(Dialogs) private database: Repository<Dialogs>,
  ) {}

  async search(
    keyword: string,
    fields: ('content' | 'filename')[],
    from?: number,
    size?: number,
  ) {
    return this.elastic.search(keyword, fields, from, size);
  }

  async suggest(keyword: string, field: 'content' | 'filename') {
    return this.elastic.suggest(keyword, field);
  }
}