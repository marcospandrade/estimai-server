import { DynamicModule, Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { LoggerService } from '../logger/logger.service';
import { TerminusModule } from '@nestjs/terminus';
import { CoreService } from './core.service';
import { APP_FILTER } from '@nestjs/core';
import { UnhandledExceptionFilter } from './exception-filters/unhandled-exception/unhandled-exception.filter';
import { UnhandledExceptionFactory } from './exception-filters/unhandled-exception/unhandled-exception.factory';
import { AxiosFactory } from './exception-filters/axios/axios.factory';
import { AxiosFilter } from './exception-filters/axios/axios.filter';
import { UnhandledExceptionFactoryProvider } from './exception-filters/unhandled-exception/unhandled-exception.provider';
import { AxiosFactoryProvider } from './exception-filters/axios/axios.provider';

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
          provide: LoggerService,
          useValue: new LoggerService(),
        },
        UnhandledExceptionFactory,
        AxiosFactoryProvider,
      ],
      exports: [CoreService, UnhandledExceptionFactoryProvider, AxiosFactoryProvider],
    };
  }
}
