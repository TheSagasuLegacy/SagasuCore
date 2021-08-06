import { Logger } from '@nestjs/common';
import { DialogsIndexService } from 'src/elastic-index/dialogs/dialogs.service';
import { storage } from 'src/request-local.middleware';
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Dialogs } from './entities/dialog.entity';

export const BULK_SYMBOL = 'isBulk';

@EventSubscriber()
export class DialogsSubscriber implements EntitySubscriberInterface<Dialogs> {
  private logger: Logger = new Logger(DialogsSubscriber.name);

  constructor(
    private connection: Connection,
    private index: DialogsIndexService,
  ) {
    this.connection.subscribers.push(this);
    this.index.create();
  }

  listenTo() {
    return Dialogs;
  }

  async afterInsert(event: InsertEvent<Dialogs>) {
    const bulk = storage.getStore()?.get(BULK_SYMBOL) as boolean;
    if (bulk) {
      return;
    }
    await this.index.insert({
      id: event.entity.id,
      content: event.entity.content,
    });
  }

  async afterUpdate(event: UpdateEvent<Dialogs>) {
    const result = await this.index.insert({
      id: event.entity.id,
      content: event.entity.content,
    });
    this.logger.verbose(
      `Elastic index for ${event.entity.id} updated, body=${JSON.stringify(
        result.body,
      )}.`,
    );
  }

  async afterRemove(event: RemoveEvent<Dialogs>) {
    const result = await this.index.delete(event.entity.id);
    this.logger.verbose(
      `Elastic index for ${event.entity.id} removed, body=${JSON.stringify(
        result.body,
      )}.`,
    );
  }
}
