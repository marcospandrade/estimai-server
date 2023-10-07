import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

interface GenericResponse {
  response: object;
  message: string;
}

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value: GenericResponse) => {
        const response = value.response ? value.response : [];
        return {
          status: 'success',
          response,
          message: value.message,
        };
      }),
    );
  }
}
