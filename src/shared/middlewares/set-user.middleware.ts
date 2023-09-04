import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Response, NextFunction, Request } from 'express';

@Injectable()
export class SetUserMiddleware implements NestMiddleware {
  private readonly log = new Logger(SetUserMiddleware.name);
  private readonly jwtService = new JwtService();

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.cookie?.split('=')[1];

    if (!token) {
      this.log.error('Unauthorized tentative.');
      return res.status(401).send({ message: 'Unauthorized.' });
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_KEY,
      });
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).send({ message: 'Invalid token.' });
    }
  }
}
