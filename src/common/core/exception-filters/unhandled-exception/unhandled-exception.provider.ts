import { LoggerService } from 'src/common/logger/logger.service';
import { Provider } from '@nestjs/common';
import { UnhandledExceptionFactory } from './unhandled-exception.factory';

export const UnhandledExceptionFactoryProvider: Provider = {
    provide: UnhandledExceptionFactory,
    useFactory: (logger: LoggerService) => {
        return new UnhandledExceptionFactory(logger);
    },
    inject: [LoggerService],
};
