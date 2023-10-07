import { DynamicModule, Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { LoggerService } from '../logger/logger.service';
import { TerminusModule } from '@nestjs/terminus';
import { CoreService } from './core.service';
import { APP_FILTER } from '@nestjs/core';
import { UnhandledExceptionFilter } from './exception-filters/unhandled-exception.filter';

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
          useFactory: (loggerService: LoggerService) => {
            loggerService.info('Registering global exception filter');
            return new UnhandledExceptionFilter(loggerService);
          },
          inject: [LoggerService],
        },
        {
          provide: LoggerService,
          useValue: new LoggerService(),
        },
      ],
    };
  }
}
