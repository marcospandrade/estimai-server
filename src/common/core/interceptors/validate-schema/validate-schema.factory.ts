import { ValidationError, getMetadataStorage } from 'class-validator';

import { ExecutionContext, Injectable, InternalServerErrorException } from '@nestjs/common';

import {
  VALIDATE_RESPONSE_SCHEMA_METADATA_KEY,
  ValidateResponseSchemaMetadata,
} from '../../decorators/validate-response-schema';
import { LoggerService } from '../../../logger/logger.service';
import { ObjValidator } from 'src/common/config/obj-validator';
import { ValidationFailedException } from '../../exceptions/validation-failed-exception';
import { GenericHttpResponse } from '../format-response/types/generic-http-response';

@Injectable()
export class ValidateSchemaFactory {
  constructor(private logger: LoggerService) {}

  validateSchema<T>(context: ExecutionContext, data: GenericHttpResponse<T>) {
    const metadata = this.getValidationSchema(context);
    if (!metadata?.schema || !data) {
      this.logger.debug('No schema or data to validate', {
        schema: metadata?.schema,
        data,
      });
      return data;
    }

    const { schema } = metadata;

    if (!this.checkIfClassIsSchema(schema)) {
      this.logger.warn(
        {
          schema,
          data,
        },
        `Schema ${schema?.prototype?.name ?? schema?.name ?? 'unknown'} is not a class-validator schema`,
      );

      return data;
    }

    let validationErrors: ValidationError[] = [];

    if (Array.isArray(data) && typeof data[1] === 'object') {
      validationErrors = this.validate(schema, data) as ValidationError[];
    } else if (Array.isArray(data) && typeof data[1] === 'number') {
      // paginated response
      validationErrors = this.validate(schema, data[0]) as ValidationError[];
    }

    this.isUnknownError(validationErrors);

    if (validationErrors) {
      this.logHasUnknownValidationError(validationErrors);

      validationErrors = this.removeUneededProperties(validationErrors);

      throw new ValidationFailedException({ validationErrors });
    }

    return data;
  }

  isEventStreamResponse(context: ExecutionContext) {
    return context.switchToHttp().getResponse().getHeaders()['content-type']?.includes('text/event-stream');
  }

  getValidationSchema(context: ExecutionContext) {
    const schema = Reflect.getMetadata(VALIDATE_RESPONSE_SCHEMA_METADATA_KEY, context.getHandler());

    return schema as ValidateResponseSchemaMetadata<any>;
  }

  private validate(schema: any, data: any): ValidationError[] | null {
    if (Array.isArray(data)) {
      return this._validateArraySchema(schema, data);
    } else {
      return this._validateSchema(schema, data);
    }
  }

  private logHasUnknownValidationError(validationErrors: ValidationError[]) {
    const hasUnknownValidationError = validationErrors.some(
      (error) => error.constraints && Object.keys(error.constraints).includes('unknownValue'),
    );

    if (hasUnknownValidationError) {
      this.logger.error(validationErrors, `Unknown validation error`);
    } else {
      this.logger.warn(validationErrors, `Validation error`);
    }
  }

  private removeUneededProperties(validationErrors: ValidationError[]) {
    return validationErrors.map((error) => {
      const { target, ...rest } = error;

      return {
        target: {
          id: (target as any)['id'] ?? (target as any)['name'],
        },
        ...rest,
      };
    });
  }

  private _validateArraySchema(schema: any, data: any) {
    const validationErrors = [];
    for (const item of data) {
      try {
        ObjValidator.forCustom(schema, item);
      } catch (error) {
        validationErrors.push(error);
      }
    }

    return validationErrors.length ? validationErrors.flat(1) : null;
  }

  private _validateSchema(schema: any, data: any) {
    try {
      ObjValidator.forCustom(schema, data);
    } catch (error) {
      return error;
    }
  }

  // eslint-disable-next-line
  private checkIfClassIsSchema(targetConstructor: Function) {
    const metadataStorage = getMetadataStorage();
    const targetMetadatas = metadataStorage.getTargetValidationMetadatas(targetConstructor, '', false, false, []);

    const groupedMetadatas = metadataStorage.groupByPropertyName(targetMetadatas);

    const decorators = Object.fromEntries(
      Object.entries(groupedMetadatas).map(([property, decorators]) => {
        const CM = decorators.map((decorator) =>
          metadataStorage.getTargetValidatorConstraints(decorator.constraintCls).map((v) => v.name),
        );
        return [property, CM.flat()];
      }),
    );

    const hasDecorators = Object.keys(decorators ?? {}).length > 0;

    return hasDecorators;
  }

  private isUnknownError(validationErrors: ValidationError[]) {
    if (!(validationErrors instanceof Array) && validationErrors) {
      this.logger.error(validationErrors, `Unknown validation error`);

      throw new InternalServerErrorException();
    }
  }
}
