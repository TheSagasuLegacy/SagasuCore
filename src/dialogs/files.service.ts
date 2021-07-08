import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { SubtitleFile } from './entities/files.entity';

@Injectable()
export class FilesService extends TypeOrmCrudService<SubtitleFile> {
  constructor(@InjectRepository(SubtitleFile) repo: Repository<SubtitleFile>) {
    super(repo);
  }
}
