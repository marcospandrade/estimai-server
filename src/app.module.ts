import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { SprintModule } from './modules/sprint/sprint.module';
import { SetUserMiddleware } from './shared/middlewares/set-user.middleware';
import { IssuesModule } from './modules/issues/issues.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    SprintModule,
    IssuesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SetUserMiddleware)
      .exclude({
        path: 'auth/login',
        method: RequestMethod.POST,
      })
      .forRoutes(
        '*', // apply to all routes in the app
      );
  }
}
