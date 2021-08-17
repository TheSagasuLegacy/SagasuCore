import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppResources } from 'src/app.roles';
import { CrudBaseService } from 'src/crud-base.service';
import { Repository } from 'typeorm';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { Episodes } from './entities/episodes.entity';

@Injectable()
export class EpisodesService extends CrudBaseService<
  Episodes,
  number,
  CreateEpisodeDto,
  UpdateEpisodeDto
> {
  constructor(
    @InjectRepository(Episodes) repo: Repository<Episodes>,
    @InjectRolesBuilder() private readonly rolesBuilder: RolesBuilder,
  ) {
    super(repo, 'id');
  }

  canCreate(data: { dto: CreateEpisodeDto; user: Express.User }) {
    const { dto, user } = data;
    return dto.user_id === user.id
      ? this.rolesBuilder.can(user.roles).createOwn(AppResources.EPISODE)
          .granted
      : this.rolesBuilder.can(user.roles).createAny(AppResources.EPISODE)
          .granted;
  }

  canRead(data: { entity?: Episodes; user: Express.User }) {
    const { entity, user } = data;
    return entity?.user_id === user.id
      ? this.rolesBuilder.can(user.roles).readOwn(AppResources.EPISODE).granted
      : this.rolesBuilder.can(user.roles).readAny(AppResources.EPISODE).granted;
  }

  canUpdate(data: {
    dto: UpdateEpisodeDto;
    entity: Episodes;
    user: Express.User;
  }) {
    const { entity, user } = data;
    return entity.user_id === user.id
      ? this.rolesBuilder.can(user.roles).updateOwn(AppResources.EPISODE)
          .granted
      : this.rolesBuilder.can(user.roles).updateAny(AppResources.EPISODE)
          .granted;
  }

  canDelete(data: { primary: number; entity: Episodes; user: Express.User }) {
    const { entity, user } = data;
    return entity.user_id === user.id
      ? this.rolesBuilder.can(user.roles).deleteOwn(AppResources.EPISODE)
          .granted
      : this.rolesBuilder.can(user.roles).deleteAny(AppResources.EPISODE)
          .granted;
  }
}
