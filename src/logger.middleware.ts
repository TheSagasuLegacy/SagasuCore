import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { clc } from '@nestjs/common/utils/cli-colors.util';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: Logger = new Logger(LoggerMiddleware.name);
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.setContext;
    const begin = new Date().getTime();
    res.on('finish', () => {
      const delta = new Date().getTime() - begin;
      this.logger.log(
        clc.cyanBright(req.ip) +
          ' - ' +
          clc.red(req.method) +
          ' | ' +
          clc.green(req.originalUrl) +
          ' ' +
          clc.magentaBright(res.statusCode.toString()) +
          ' ' +
          clc.yellow(`+${delta}ms`),
      );
    });
    next();
  }
}
