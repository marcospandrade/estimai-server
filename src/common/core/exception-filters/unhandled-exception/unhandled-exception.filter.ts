import { Request } from 'express';

import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

import { UnhandledExceptionFactory } from './unhandled-exception.factory';
import { LoggerService } from '../../../logger/logger.service';
import { InterceptedError } from './types/intercepted-error';

@Catch(Error)
export class UnhandledExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService, private readonly factory: UnhandledExceptionFactory) {}

  catch(exception: InterceptedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = this.factory.determineStatus(exception);
    const errorResponse = this.factory.buildErrorResponse(exception, request);

    this.logError(exception, request);

    return response.status(status).json(errorResponse);
  }

  private logError(exception: InterceptedError, request: Request): void {
    this.logger.error(
      {
        requestId: request['id'],
        path: request.url,
        stack: exception.stack,
        ...((exception as any)['validationErrors'] && {
          validationErrors: (exception as any)['validationErrors'],
        }),
        ...((exception as any)['options'] && {
          options: (exception as any)['options'],
        }),
      },
      'Unhandled exception',
    );
  }
}
