import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const ms = Date.now() - start;
      const color = statusCode >= 500
        ? '\x1b[31m'   // red
        : statusCode >= 400
          ? '\x1b[33m' // yellow
          : '\x1b[32m'; // green
      const reset = '\x1b[0m';

      this.logger.log(
        `${method} ${originalUrl} ${color}${statusCode}${reset} +${ms}ms`,
      );
    });

    next();
  }
}
