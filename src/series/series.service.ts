import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppResources } from 'src/app.roles';
import { CrudBaseService } from 'src/crud-base.service';
import { Repository } from 'typeorm';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { Series } from './entities/series.entity';

@Injectable()
export class SeriesService extends CrudBaseService<
  Series,
  number,
  CreateSeriesDto,
  UpdateSeriesDto
> {
  constructor(
    @InjectRepository(Series) repo: Repository<Series>,
    @InjectRolesBuilder() private readonly rolesBuilder: RolesBuilder,
  ) {
    super(repo, 'id');
  }

  canCreate(data: { dto: CreateSeriesDto; user: Express.User }) {
    const { dto, user } = data;
    return dto.user_id === user.id
      ? this.rolesBuilder.can(user.roles).createOwn(AppResources.SERIES).granted
      : this.rolesBuilder.can(user.roles).createOwn(AppResources.SERIES)
          .granted;
  }

  canRead(data: { entity?: Series; user: Express.User }) {
    const { entity, user } = data;
    return entity?.user_id === user.id
      ? this.rolesBuilder.can(user.roles).readOwn(AppResources.SERIES).granted
      : this.rolesBuilder.can(user.roles).readAny(AppResources.SERIES).granted;
  }

  canUpdate(data: {
    dto: UpdateSeriesDto;
    entity: Series;
    user: Express.User;
  }) {
    const { entity, user } = data;
    return entity.user_id === user.id
      ? this.rolesBuilder.can(user.roles).updateOwn(AppResources.SERIES).granted
      : this.rolesBuilder.can(user.roles).updateAny(AppResources.SERIES)
          .granted;
  }

  canDelete(data: { primary: number; entity: Series; user: Express.User }) {
    const { entity, user } = data;
    return entity.user_id === user.id
      ? this.rolesBuilder.can(user.roles).deleteOwn(AppResources.SERIES).granted
      : this.rolesBuilder.can(user.roles).deleteAny(AppResources.SERIES)
          .granted;
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
