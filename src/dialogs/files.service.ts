import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { SubtitleFile } from './entities/files.entity';

@Injectable()
export class FilesService extends TypeOrmCrudService<SubtitleFile> {
  constructor(@InjectRepository(SubtitleFile) repo: Repository<SubtitleFile>) {
    super(repo);
  }

  async getBySha1(sha1: string): Promise<SubtitleFile> {
    const result = await this.repo.findOne(
      { sha1: sha1 },
      { relations: ['dialogs'] },
    );
    if (result == undefined) {
      throw new NotFoundException(null, 'Not found file by sha1');
    }
    return result;
  }
}
