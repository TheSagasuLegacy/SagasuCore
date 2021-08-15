import { Injectable, NestMiddleware } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { NextFunction, Request, Response } from 'express';

export class RequestLocal extends Map<string, unknown> {
  readonly REQUEST_KEY = 'request';

  constructor(request: Request) {
    super();
    this.set(this.REQUEST_KEY, request);
  }

  get request(): Request {
    return this.get(this.REQUEST_KEY) as Request;
  }
}

export const storage = new AsyncLocalStorage<RequestLocal>();

@Injectable()
export class RequestLocalMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    storage.run(new RequestLocal(req), next);
  }
}
