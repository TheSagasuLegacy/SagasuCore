import { Logger } from '@nestjs/common';
import { DialogsIndexService } from 'src/elastic-index/dialogs/dialogs.service';
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Dialogs } from './entities/dialog.entity';

@EventSubscriber()
export class DialogsSubscriber implements EntitySubscriberInterface<Dialogs> {
  private logger: Logger = new Logger(DialogsSubscriber.name);

  constructor(
    private connection: Connection,
    private elasticIndex: DialogsIndexService,
  ) {
    this.connection.subscribers.push(this);
    this.elasticIndex.create();
  }

  listenTo() {
    return Dialogs;
  }

  async afterInsert(event: InsertEvent<Dialogs>) {
    const result = await this.elasticIndex.insert({
      id: event.entity.id,
      content: event.entity.content,
      filename: event.entity.file.filename,
    });
    this.logger.verbose(
      `Elastic index for ${event.entity.id} inserted, body=${JSON.stringify(
        result.body,
      )}.`,
    );
  }

  async afterUpdate(event: UpdateEvent<Dialogs>) {
    const result = await this.elasticIndex.insert({
      id: event.entity.id,
      content: event.entity.content,
      filename: event.entity.file.filename,
    });
    this.logger.verbose(
      `Elastic index for ${event.entity.id} updated, body=${JSON.stringify(
        result.body,
      )}.`,
    );
  }

  async afterRemove(event: RemoveEvent<Dialogs>) {
    const result = await this.elasticIndex.delete(event.entity.id);
    this.logger.verbose(
      `Elastic index for ${event.entity.id} removed, body=${JSON.stringify(
        result.body,
      )}.`,
    );
  }
}
