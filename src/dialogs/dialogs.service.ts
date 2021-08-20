import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppResources } from 'src/app.roles';
import { ICreateMany } from 'src/crud-base.models';
import { CrudBaseService } from 'src/crud-base.service';
import { DialogsIndexService } from 'src/elastic-index/dialogs/dialogs.service';
import { storage } from 'src/request-local.middleware';
import { Repository } from 'typeorm';
import { BULK_SYMBOL } from './dialogs.subscriber';
import { CreateDialogDto } from './dto/create-dialog.dto';
import { UpdateDialogDto } from './dto/update-dialog.dto';
import { Dialogs } from './entities/dialog.entity';

@Injectable()
export class DialogsService extends CrudBaseService<
  Dialogs,
  string,
  CreateDialogDto,
  UpdateDialogDto
> {
  logger: Logger = new Logger(DialogsService.name);

  constructor(
    @InjectRepository(Dialogs) repo: Repository<Dialogs>,
    @InjectRolesBuilder() private readonly rolesBuilder: RolesBuilder,
    private readonly index: DialogsIndexService,
  ) {
    super(repo, 'id');
  }

  canCreate(data: { dto: CreateDialogDto; user: Express.User }) {
    return data.dto.user_id === data.user.id
      ? this.rolesBuilder.can(data.user.roles).createOwn(AppResources.DIALOG)
          .granted
      : this.rolesBuilder.can(data.user.roles).createAny(AppResources.DIALOG)
          .granted;
  }

  canRead(data: { primary: string; entity?: Dialogs; user: Express.User }) {
    return data.entity?.user_id === data.user.id
      ? this.rolesBuilder.can(data.user.roles).readOwn(AppResources.DIALOG)
          .granted
      : this.rolesBuilder.can(data.user.roles).readAny(AppResources.DIALOG)
          .granted;
  }

  canUpdate(data: {
    dto: UpdateDialogDto;
    entity?: Dialogs;
    user: Express.User;
  }) {
    return data.entity?.user_id === data.user.id
      ? this.rolesBuilder.can(data.user.roles).updateOwn(AppResources.DIALOG)
          .granted
      : this.rolesBuilder.can(data.user.roles).updateAny(AppResources.DIALOG)
          .granted;
  }

  canDelete(data: { primary: string; entity?: Dialogs; user: Express.User }) {
    return data.entity?.user_id === data.user.id
      ? this.rolesBuilder.can(data.user.roles).deleteOwn(AppResources.DIALOG)
          .granted
      : this.rolesBuilder.can(data.user.roles).deleteAny(AppResources.DIALOG)
          .granted;
  }

  getByFileId(fileId: string): Promise<Dialogs[]> {
    return this.repo.find({ where: { file: fileId } });
  }

  async createMany(
    dto: ICreateMany<CreateDialogDto>,
    chunk = 50,
  ): Promise<Dialogs[]> {
    storage.getStore()?.set(BULK_SYMBOL, true);
    const createResult = await super.createMany(dto, chunk);
    const indexResult = await this.index.bulkInsert(createResult);
    this.logger.debug(
      `Bulk indexed ${createResult.length} dialogs, ` +
        `response ${JSON.stringify(indexResult)}`,
    );
    return createResult;
  }
}
