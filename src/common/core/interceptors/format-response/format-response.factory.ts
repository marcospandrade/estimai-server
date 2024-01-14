import { ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LoggerService } from '../../../logger/logger.service';
import { ResponseMessage } from '../../decorators/response-message';
import { GenericHttpResponse } from './types/generic-http-response';

@Injectable()
export class FormatResponseFactory {
  constructor(private logger: LoggerService, private reflector: Reflector) {}

  mountGenericResponse<T>(data: T, context: ExecutionContext): GenericHttpResponse<T> {
    if (!data) {
      throw new NotFoundException();
    }

    const response = {
      response: data,
      message: this.getResponseMessage(context),
    };

    if (Array.isArray(data) && typeof data[1] === 'number') {
      // paginated response
      response.response = {
        records: data[0],
        count: data[1],
      } as any;
    }

    return response;
  }

  isEventStreamResponse(context: ExecutionContext) {
    return context.switchToHttp().getResponse().getHeaders()['content-type']?.includes('text/event-stream');
  }

  private getResponseMessage(context: ExecutionContext) {
    const responseMessages = this.reflector.get(ResponseMessage, context.getHandler());

    return responseMessages ?? 'success';
  }
}
