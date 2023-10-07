import { Module } from '@nestjs/common';

import { SprintUseCases } from './use-cases/sprint.use-cases';
import { SprintController } from './sprint.controller';
import { AtlassianModule } from 'src/common/atlassian/atlassian.module';
import { AuthUseCase } from '../auth/use-cases/auth.use-cases';
import { AuthFactoryService } from '../auth/use-cases/auth-factory.service';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { AuthModule } from '@modules/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AtlassianModule, PrismaModule],
  controllers: [SprintController],
  providers: [SprintUseCases, AuthUseCase, AuthFactoryService, JwtService],
})
export class SprintModule {}
