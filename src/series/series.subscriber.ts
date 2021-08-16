import { Logger } from '@nestjs/common';
import { SeriesIndexService } from 'src/elastic-index/series/series.service';
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Series } from './entities/series.entity';

@EventSubscriber()
export class SeriesSubscriber implements EntitySubscriberInterface<Series> {
  private logger: Logger = new Logger(SeriesSubscriber.name);

  constructor(
    private connection: Connection,
    private elasticIndex: SeriesIndexService,
  ) {
    this.connection.subscribers.push(this);
    void this.elasticIndex.create();
  }

  listenTo() {
    return Series;
  }

  async afterInsert(event: InsertEvent<Series>) {
    const result = await this.elasticIndex.insert({
      id: event.entity.id,
      name: event.entity.name,
      name_cn: event.entity.name_cn,
      description: event.entity.description,
    });
    this.logger.verbose(
      `Elastic index for ${event.entity.id} inserted, body=${JSON.stringify(
        result.body,
      )}.`,
    );
  }

  async afterUpdate(event: UpdateEvent<Series>) {
    const { id, name, name_cn, description } = event.entity as Series;
    const result = await this.elasticIndex.insert({
      id,
      name,
      name_cn,
      description,
    });
    this.logger.verbose(
      `Elastic index for ${id} updated, body=${JSON.stringify(result.body)}.`,
    );
  }

  async afterRemove(event: RemoveEvent<Series>) {
    const { id } = event.entity as Series;
    const result = await this.elasticIndex.delete(id);
    this.logger.verbose(
      `Elastic index for ${id} removed, body=${JSON.stringify(result.body)}.`,
    );
  }
}
