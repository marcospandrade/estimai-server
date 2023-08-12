import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AuthFactoryService } from './use-cases/auth-factory.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { AuthUseCase } from './use-cases/auth.use-cases';
import { AtlassianModule } from 'src/core/atlassian/atlassian.module';

@Module({
  imports: [PrismaModule, HttpModule, AtlassianModule],
  controllers: [AuthController],
  providers: [AuthFactoryService, AuthUseCase],
  exports: [AuthUseCase],
})
export class AuthModule {}
