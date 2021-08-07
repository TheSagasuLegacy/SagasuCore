import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { clc } from '@nestjs/common/utils/cli-colors.util';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: Logger = new Logger(LoggerMiddleware.name);
  use(req: Request, res: Response, next: NextFunction) {
    const begin = new Date().getTime();
    res.on('finish', () => {
      const delta = new Date().getTime() - begin;
      const { ip, method, originalUrl } = req;
      const { statusCode } = res;
      this.logger.log(
        clc.cyanBright(ip) +
          ' - ' +
          clc.red(method) +
          ' | ' +
          clc.green(originalUrl) +
          ' ' +
          clc.magentaBright(statusCode.toString()) +
          ' ' +
          clc.yellow(`+${delta}ms`),
      );
    });
    next();
  }
}
