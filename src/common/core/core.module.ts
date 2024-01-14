import { DynamicModule, Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { LoggerService } from '../logger/logger.service';
import { TerminusModule } from '@nestjs/terminus';
import { CoreService } from './core.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { UnhandledExceptionFilter } from './exception-filters/unhandled-exception/unhandled-exception.filter';
import { UnhandledExceptionFactory } from './exception-filters/unhandled-exception/unhandled-exception.factory';
import { AxiosFactory } from './exception-filters/axios/axios.factory';
import { AxiosFilter } from './exception-filters/axios/axios.filter';
import { UnhandledExceptionFactoryProvider } from './exception-filters/unhandled-exception/unhandled-exception.provider';
import { AxiosFactoryProvider } from './exception-filters/axios/axios.provider';
import { FormatResponseInterceptor } from './interceptors/format-response/format-response.interceptor';
import { FormatResponseFactory } from './interceptors/format-response/format-response.factory';
import { FormatResponseFactoryProvider } from './interceptors/format-response/format-response.provider';

@Module({})
export class CoreModule {
  static register(): DynamicModule {
    return {
      global: true,
      module: CoreModule,
      imports: [TerminusModule],
      controllers: [CoreController],
      providers: [
        CoreService,
        {
          provide: APP_FILTER,
          useFactory: (loggerService: LoggerService, factory: UnhandledExceptionFactory) => {
            loggerService.info('Registering global exception filter');

            return new UnhandledExceptionFilter(loggerService, factory);
          },
          inject: [LoggerService, UnhandledExceptionFactory],
        },
        {
          provide: APP_FILTER,
          useFactory: (logger: LoggerService, factory: AxiosFactory) => {
            logger.info('Registering AxiosFilter');

            return new AxiosFilter(logger, factory);
          },
          inject: [LoggerService, AxiosFactory],
        },
        {
          provide: APP_INTERCEPTOR,
          useFactory: (logger: LoggerService, factory: FormatResponseFactory) => {
            logger.info('Registering FormatResponseInterceptor');

            return new FormatResponseInterceptor(logger, factory);
          },
          inject: [LoggerService, FormatResponseFactory],
        },
        {
          provide: APP_INTERCEPTOR,
          useFactory: (logger: LoggerService, factory: ValidateSchemaFactory) => {
            logger.info('Registering ValidateSchemaInterceptor');

            return new ValidateSchemaInterceptor(logger, factory);
          },
          inject: [LoggerService, ValidateSchemaFactory],
        },
        {
          provide: LoggerService,
          useValue: new LoggerService(),
        },
        UnhandledExceptionFactory,
        AxiosFactoryProvider,
        FormatResponseFactoryProvider,
      ],
      exports: [CoreService, UnhandledExceptionFactoryProvider, AxiosFactoryProvider, FormatResponseFactoryProvider],
    };
  }
}
