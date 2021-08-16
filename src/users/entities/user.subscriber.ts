import * as argon2 from 'argon2';
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { User } from './user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(private connection: Connection) {
    this.connection.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    if (event.entity.password) {
      event.entity.password = await argon2.hash(event.entity.password);
    }
  }

  async beforeUpdate(event: UpdateEvent<User>) {
    if (
      typeof event.entity?.password === 'string' &&
      !!event.entity.password.trim() &&
      event.entity.password !== event.databaseEntity.password
    ) {
      event.entity.password = await argon2.hash(event.entity.password);
    }
  }
}
