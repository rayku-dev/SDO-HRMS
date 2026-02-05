// logger.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken'; // npm install jsonwebtoken

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    let userInfo = 'User: Anonymous';

    const authHeader = req.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        userInfo = `User: ${decoded.sub} (${decoded.email}, role: ${decoded.role})`;
      } catch (err) {
        this.logger.warn(`Token error: ${err.message}`);
      }
    }

    this.logger.log(`[Request] ${req.method} ${req.originalUrl} - ${userInfo}`);

    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.log(
        `[Response] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms - ${userInfo}`,
      );
    });

    next();
  }
}
