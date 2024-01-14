import { Request } from 'express';
import { AxiosError } from 'axios';

import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { LoggerService } from 'src/common/logger/logger.service';
import { AxiosFactory } from './axios.factory';

@Catch(AxiosError)
export class AxiosFilter implements ExceptionFilter {
  constructor(private logger: LoggerService, private factory: AxiosFactory) {}

  catch(exception: AxiosError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = this.factory.determineStatus(exception);
    const errorResponse = this.factory.buildErrorResponse(exception, request);

    if (status === 500) {
      errorResponse.message = 'Internal server error';
    }

    this.logError(exception, request);

    response.status(status).json(errorResponse);
  }

  private async logError(exception: AxiosError, request: Request) {
    if (exception.response) {
      this.logger.error(exception.response, 'Axios error response for requestId: ' + request['id']);
    }

    this.logger.error(
      {
        requestId: request['id'],
        path: request.url,
        stack: exception.stack,
      },
      'Unhandled Axios exception',
    );
  }
}
