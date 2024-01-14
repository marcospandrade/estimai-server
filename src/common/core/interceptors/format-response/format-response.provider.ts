import { LoggerService } from '@common/logger/logger.service';
import { Provider } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FormatResponseFactory } from './format-response.factory';

export const FormatResponseFactoryProvider: Provider = {
  provide: FormatResponseFactory,
  useFactory: (logger: LoggerService, reflector: Reflector) => {
    return new FormatResponseFactory(logger, reflector);
  },
  inject: [LoggerService, Reflector],
};
