import { Logger } from '@nestjs/common';
import { DialogQueueService } from 'src/elastic-index/dialogs/dialog-queue/dialog-queue.service';
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
    private index: DialogsIndexService,
    private queue: DialogQueueService,
  ) {
    this.connection.subscribers.push(this);
    this.index.create();
  }

  listenTo() {
    return Dialogs;
  }

  async afterInsert(event: InsertEvent<Dialogs>) {
    await this.queue.push({
      id: event.entity.id,
      content: event.entity.content,
      filename: event.entity.file.filename,
    });
  }

  async afterUpdate(event: UpdateEvent<Dialogs>) {
    const result = await this.index.insert({
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
    const result = await this.index.delete(event.entity.id);
    this.logger.verbose(
      `Elastic index for ${event.entity.id} removed, body=${JSON.stringify(
        result.body,
      )}.`,
    );
  }
}
