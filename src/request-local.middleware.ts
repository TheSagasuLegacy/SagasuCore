import { Injectable, NestMiddleware } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

export class RequestLocal extends Map<string, any> {
  readonly REQUEST_KEY = 'request';

  constructor(request: Express.Request) {
    super();
    this.set(this.REQUEST_KEY, request);
  }

  get request(): Express.Request {
    return this.get(this.REQUEST_KEY);
  }
}

export const storage = new AsyncLocalStorage<RequestLocal>();

@Injectable()
export class RequestLocalMiddleware implements NestMiddleware {
  use(req: Express.Request, res: Express.Response, next: () => void) {
    storage.run(new RequestLocal(req), next);
  }
}
