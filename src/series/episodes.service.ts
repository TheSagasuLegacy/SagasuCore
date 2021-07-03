import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Episodes } from './entities/episodes.entity';

@Injectable()
export class EpisodesService extends TypeOrmCrudService<Episodes> {
  constructor(@InjectRepository(Episodes) repo: Repository<Episodes>) {
    super(repo);
  }
}
