import { LoggerService } from 'src/common/logger/logger.service';
import { Provider } from '@nestjs/common';
import { AxiosFactory } from './axios.factory';

export const AxiosFactoryProvider: Provider = {
    provide: AxiosFactory,
    useFactory: (logger: LoggerService) => {
        return new AxiosFactory(logger);
    },
    inject: [LoggerService],
};
