import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

import { LoggerService } from 'src/common/logger/logger.service';
import { ValidateSchemaFactory } from './validate-schema.factory';

@Injectable()
export class ValidateSchemaInterceptor implements NestInterceptor {
  constructor(private logger: LoggerService, private factory: ValidateSchemaFactory) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) => {
        if (this.factory.isEventStreamResponse(context)) {
          return value;
        }

        return this.factory.validateSchema(context, value);
      }),
    );
  }
}
