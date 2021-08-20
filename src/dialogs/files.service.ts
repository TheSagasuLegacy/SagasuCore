import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppResources } from 'src/app.roles';
import { CrudBaseService } from 'src/crud-base.service';
import { Repository } from 'typeorm';
import { CreateSubtitleFileDto } from './dto/create-file.dto';
import { UpdateSubtitleFileDto } from './dto/update-file.dto';
import { SubtitleFile } from './entities/files.entity';

@Injectable()
export class FilesService extends CrudBaseService<
  SubtitleFile,
  string,
  CreateSubtitleFileDto,
  UpdateSubtitleFileDto
> {
  constructor(@InjectRepository(SubtitleFile) repo: Repository<SubtitleFile>) {
    super(repo, 'id');
  }

  canCreate(data: { dto: CreateSubtitleFileDto; user: Express.User }) {
    return data.dto.user_id === data.user.id
      ? this.rolesBuilder.can(data.user.roles).createOwn(AppResources.FILE)
          .granted
      : this.rolesBuilder.can(data.user.roles).createAny(AppResources.FILE)
          .granted;
  }

  canRead(data: {
    primary?: string;
    entity?: SubtitleFile;
    user: Express.User;
  }) {
    return data.entity?.user_id === data.user.id
      ? this.rolesBuilder.can(data.user.roles).readOwn(AppResources.FILE)
          .granted
      : this.rolesBuilder.can(data.user.roles).readAny(AppResources.FILE)
          .granted;
  }

  canUpdate(data: {
    dto: UpdateSubtitleFileDto;
    entity: SubtitleFile;
    user: Express.User;
  }) {
    return data.entity.user_id === data.user.id
      ? this.rolesBuilder.can(data.user.roles).updateOwn(AppResources.FILE)
          .granted
      : this.rolesBuilder.can(data.user.roles).updateAny(AppResources.FILE)
          .granted;
  }

  canDelete(data: {
    primary?: string;
    entity?: SubtitleFile;
    user: Express.User;
  }) {
    return data.entity?.user_id === data.user.id
      ? this.rolesBuilder.can(data.user.roles).deleteOwn(AppResources.FILE)
          .granted
      : this.rolesBuilder.can(data.user.roles).deleteAny(AppResources.FILE)
          .granted;
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

  async getBySeriesId(id: number): Promise<SubtitleFile[]> {
    return this.repo.find({
      where: { series: id },
      relations: ['episode'],
    });
  }
}
