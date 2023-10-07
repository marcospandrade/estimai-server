import { NestFactory } from '@nestjs/core';
import { configureHelmet } from './common/config/common/helmet.config';
import { AppModule } from './app.module';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  configureHelmet(app);

  await app.listen(3001);
}
