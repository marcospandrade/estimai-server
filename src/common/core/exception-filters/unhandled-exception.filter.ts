import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../../logger/logger.service';
import { IntegrationError } from '@shared/helpers/req-res.helpers';
import { ReqId } from 'pino-http';

interface ErrorResponse {
  requestId: ReqId;
  path: string;
  message: string;
  stack?: string;
}

@Catch(Error)
export class UnhandledExceptionFilter implements ExceptionFilter {
  public constructor(private readonly logger: LoggerService) {}

  catch(exception: Error | IntegrationError, host: ArgumentsHost) {
    const isNotProduction = process.env.NODE_ENV !== 'production';
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse: ErrorResponse = {
      requestId: request.id,
      path: request.url,
      message: exception.message,
    };

    if (isNotProduction) {
      errorResponse.stack = exception.stack;
    }

    this.logger.error(
      {
        requestId: request.id,
        path: request.url,
        stack: exception.stack,
        ...(exception instanceof IntegrationError && {
          integrationError: exception.integrationError,
        }),
      },
      'Unhandled exception',
    );

    return response.status(status).json(errorResponse);
  }
}
