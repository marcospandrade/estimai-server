import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { IntersectionType } from '@nestjs/mapped-types';

import { BaseAppConfig, ConfigModule } from './common/config/config.module';
import { LoggerModule } from './common/logger/logger.module';
import { CoreModule } from './common/core/core.module';
import { AuthConfig } from './config';

import { AuthModule } from './modules/auth/auth.module';
import { SprintModule } from './modules/sprint/sprint.module';
import { IssuesModule } from './modules/issues/issues.module';
import { SetUserMiddleware } from './common/core/middlewares/set-user.middleware';

export class EstimAiConfig extends IntersectionType(BaseAppConfig, AuthConfig) {}

@Module({
    imports: [
        ConfigModule.registerAsync({ AppConfig: EstimAiConfig }),
        CoreModule.register(),
        LoggerModule.register(),
        AuthModule,
        SprintModule,
        IssuesModule,
        CoreModule,
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(SetUserMiddleware)
            .exclude({
                path: 'auth/login',
                method: RequestMethod.POST,
            })
            .forRoutes('*');
    }
}
