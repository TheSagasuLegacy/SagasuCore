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

  canCreate(dto: CreateSeriesDto, user?: Express.User) {
    return dto.user_id === user.id
      ? this.rolesBuilder
          .can(user.roles.map((r) => r.role))
          .createOwn(AppResources.SERIES).granted
      : this.rolesBuilder
          .can(user.roles.map((r) => r.role))
          .createOwn(AppResources.SERIES).granted;
  }

  async canRead(id?: number, user?: Express.User) {
    return (await this.isOwnBy(id, user))
      ? this.rolesBuilder
          .can(user.roles.map((r) => r.role))
          .readOwn(AppResources.SERIES).granted
      : this.rolesBuilder
          .can(user.roles.map((r) => r.role))
          .readAny(AppResources.SERIES).granted;
  }

  canUpdate(dto: UpdateSeriesDto, entity: Series, user?: Express.User) {
    return entity.user_id === user.id
      ? this.rolesBuilder
          .can(user.roles.map((r) => r.role))
          .updateOwn(AppResources.SERIES).granted
      : this.rolesBuilder
          .can(user.roles.map((r) => r.role))
          .updateAny(AppResources.SERIES).granted;
  }

  async canDelete(id: number, user?: Express.User) {
    return (await this.isOwnBy(id, user))
      ? this.rolesBuilder
          .can(user.roles.map((r) => r.role))
          .deleteOwn(AppResources.SERIES).granted
      : this.rolesBuilder
          .can(user.roles.map((r) => r.role))
          .deleteAny(AppResources.SERIES).granted;
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

  protected async isOwnBy(id: number, user: Express.User) {
    return await this.repo
      .findOne(id)
      .then((entity) => entity?.user_id === user.id);
  }
}
