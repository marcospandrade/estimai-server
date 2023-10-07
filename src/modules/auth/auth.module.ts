import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AuthFactoryService } from './use-cases/auth-factory.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { AuthUseCase } from './use-cases/auth.use-cases';
import { AtlassianModule } from 'src/common/atlassian/atlassian.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    AtlassianModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRES },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthFactoryService, AuthUseCase],
  exports: [AuthUseCase],
})
export class AuthModule {}
