import { Module } from '@nestjs/common';

import { SprintService } from './use-cases/sprint.service';
import { SprintController } from './sprint.controller';
import { AtlassianModule } from 'src/core/atlassian/atlassian.module';
import { AuthUseCase } from '../auth/use-cases/auth.use-cases';
import { AuthFactoryService } from '../auth/use-cases/auth-factory.service';
import { PrismaModule } from 'src/shared/prisma/prisma.module';

@Module({
  imports: [AtlassianModule, PrismaModule],
  controllers: [SprintController],
  providers: [SprintService, AuthUseCase, AuthFactoryService],
})
export class SprintModule {}
