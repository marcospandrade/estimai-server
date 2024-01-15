import { Injectable, NestMiddleware, Request } from '@nestjs/common';

import { Response, NextFunction } from 'express';

import { LoggerService } from '../logger/logger.service';
import { IUser } from '@modules/auth/entities/user.entity';
// import { Integration } from '@modules/integration/entities/integration.entity';

export interface RequestWithUser extends Request {
    /** The full User record for the current user */
    user: IUser;

    /** The ID of the request */
    id: string;
}

/**
 * Middleware that adds additional data for the current user to the Request object
 * This can be accessed in the controller by using the CurrentUser decorator
 */
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private readonly loggerService: LoggerService) {}

    async use(req: RequestWithUser, res: Response, next: NextFunction) {
        if ('user' in req) {
            this.loggerService.debug(`Current user: is ${req.user.name}, with ID: ${req.user.id}`);
        } else {
            this.loggerService.debug('Current user is not set in request');
        }

        next();
    }
}
