import { DynamicModule, Module } from '@nestjs/common';
import { PARAMS_PROVIDER_TOKEN, Params, LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { getDefaultParams } from './logger.options';
import { LoggerService } from './logger.service';
export { PinoLogger, Logger } from 'nestjs-pino';

/**
 * This module is the logger module that takes optional user defined logger configurations.
 *
 * It provides different logging methods through the {@link LoggerService}, which can be injected into controller, service, module, etc.
 *
 * Optional Logger options {@link Params} could be configured through the {@link LoggerModule.register} method.
 *
 * Default Logger options {@link getDefaultParams} are used if no options are provided.
 * @example
 *   constructor(
 *       private readonly loggerService: LoggerService,
 *   ) {
 *       this.loggerService.log('Hello World!');
 *   }
 *
 */
@Module({})
export class LoggerModule {
  static register(params?: Params): DynamicModule {
    const _params = params ?? getDefaultParams();
    return {
      global: true,
      module: LoggerModule,
      imports: [PinoLoggerModule.forRoot(_params)],
      exports: [LoggerService],
      providers: [
        LoggerService,
        {
          provide: PARAMS_PROVIDER_TOKEN,
          useValue: _params,
        },
      ],
    };
  }
}
