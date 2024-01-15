import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Response, NextFunction, Request } from 'express';

import { AuthConfig } from 'src/config';
import { LoggerService } from '@common/logger/logger.service';

@Injectable()
export class SetUserMiddleware implements NestMiddleware {
    public constructor(
        private readonly configService: ConfigService<AuthConfig>,
        private readonly loggerService: LoggerService,
        private readonly jwtService: JwtService,
    ) {}

    public async use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.cookie?.split('=')[1];

        if (!token) {
            this.loggerService.error('Unauthorized tentative.');
            return res.status(401).send({ message: 'Unauthorized.' });
        }

        try {
            const decoded = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_KEY'),
            });
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).send({ message: 'Invalid token.' });
        }
    }
}
