import { Provider } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { LoggerService } from '@common/logger/logger.service';
import { ValidateSchemaFactory } from './validate-schema.factory';

export const ValidateSchemaFactoryProvider: Provider = {
  provide: ValidateSchemaFactory,
  useFactory: (logger: LoggerService) => {
    return new ValidateSchemaFactory(logger);
  },
  inject: [LoggerService, Reflector],
};
