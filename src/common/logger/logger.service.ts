import { Inject, Injectable } from '@nestjs/common';
import { PARAMS_PROVIDER_TOKEN, Params, PinoLogger } from 'nestjs-pino';
import { getDefaultParams } from './logger.options';
@Injectable()
export class LoggerService extends PinoLogger {
  constructor(
    @Inject(PARAMS_PROVIDER_TOKEN)
    params: Params = getDefaultParams(),
  ) {
    super(params);

    this.setContext('LoggerService');
  }

  createChildLogger(childContext: Record<string, any>) {
    return this.logger.child(childContext);
  }
}
