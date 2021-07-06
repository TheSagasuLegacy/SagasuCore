import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Dialogs } from './entities/dialog.entity';

@Injectable()
export class DialogsService extends TypeOrmCrudService<Dialogs> {
  constructor(@InjectRepository(Dialogs) repo: Repository<Dialogs>) {
    super(repo);
  }
}
