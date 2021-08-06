import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateManyDto, CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DialogsIndexService } from 'src/elastic-index/dialogs/dialogs.service';
import { storage } from 'src/request-local.middleware';
import { DeepPartial, Repository } from 'typeorm';
import { BULK_SYMBOL } from './dialogs.subscriber';
import { Dialogs } from './entities/dialog.entity';

@Injectable()
export class DialogsService extends TypeOrmCrudService<Dialogs> {
  logger: Logger = new Logger(DialogsService.name);

  constructor(
    @InjectRepository(Dialogs) repo: Repository<Dialogs>,
    private index: DialogsIndexService,
  ) {
    super(repo);
  }

  getByFileId(fileId: string): Promise<Dialogs[]> {
    return this.repo.find({ where: { file: fileId } });
  }

  async createMany(
    req: CrudRequest,
    dto: CreateManyDto<DeepPartial<Dialogs>>,
  ): Promise<Dialogs[]> {
    storage.getStore()?.set(BULK_SYMBOL, true);
    const createResult = await super.createMany(req, dto);
    const indexResult = await this.index.bulkInsert(createResult);
    this.logger.debug(
      `Bulk indexed ${createResult.length} dialogs, ` +
        `response ${JSON.stringify(indexResult)}`,
    );
    return createResult;
  }
}
