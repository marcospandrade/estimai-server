import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthFactoryService } from './use-cases/auth-factory.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { AuthUseCase } from './use-cases/auth.use-cases';
import { AtlassianModule } from 'src/common/atlassian/atlassian.module';
import { EstimAiConfig } from 'src/app.module';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    AtlassianModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService<EstimAiConfig>) => {
        const secret = configService.get('JWT_KEY');
        const expiresIn = configService.get('JWT_EXPIRES');

        return {
          global: true,
          secret,
          signOptions: {
            expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthUseCase, AuthFactoryService, JwtService, ConfigService],
  exports: [AuthUseCase, AuthFactoryService, JwtService],
})
export class AuthModule {}
