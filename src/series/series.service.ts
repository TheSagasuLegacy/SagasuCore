import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Series } from './entities/series.entity';

@Injectable()
export class SeriesService extends TypeOrmCrudService<Series> {
  constructor(@InjectRepository(Series) repo: Repository<Series>) {
    super(repo);
  }

  async getByBgmId(bgmId: number): Promise<Series> {
    const result = await this.repo.findOne(
      { bangumi_id: bgmId },
      { relations: ['episodes'] },
    );
    if (result == undefined) {
      throw new NotFoundException(null, 'Not found series by bangumi_id');
    }
    return result;
  }
}
