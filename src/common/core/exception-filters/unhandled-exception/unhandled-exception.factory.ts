import { Request } from 'express';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoggerService } from '../../../logger/logger.service';
import { ValidationFailedException } from '../../exceptions/validation-failed-exception';
import { ErrorResponse } from './types/error-response';
import { InterceptedError } from './types/intercepted-error';

@Injectable()
export class UnhandledExceptionFactory {
    constructor(private logger: LoggerService) {}

    buildErrorResponse(exception: InterceptedError, request: Request): ErrorResponse {
        const errorResponse: ErrorResponse = {
            requestId: request['id'] as string,
            path: request.url,
            message: exception.message,
        };

        if (exception instanceof ValidationFailedException) {
            errorResponse.validationErrors = exception.validationErrors;
        }

        return errorResponse;
    }

    determineStatus(exception: InterceptedError): number {
        if (exception instanceof HttpException) {
            return exception.getStatus();
        } else {
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
}
