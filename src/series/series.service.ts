import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { Series } from './entities/series.entity';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Series)
    private seriesRepository: Repository<Series>,
  ) {}

  create(createSeriesDto: CreateSeriesDto) {
    return 'This action adds a new series';
  }

  async findAll() {
    return await this.seriesRepository.find();
  }

  async findOne(id: number) {
    return await this.seriesRepository.findOne(id);
  }

  update(id: number, updateSeriesDto: UpdateSeriesDto) {
    return `This action updates a #${id} series`;
  }

  remove(id: number) {
    return `This action removes a #${id} series`;
  }
}
