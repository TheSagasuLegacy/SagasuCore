import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Series } from './entities/series.entity';

@Injectable()
export class SeriesService extends TypeOrmCrudService<Series> {
  constructor(@InjectRepository(Series) repo: Repository<Series>) {
    super(repo);
  }
}
