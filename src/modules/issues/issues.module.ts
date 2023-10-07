import { Module } from '@nestjs/common';
import { IssuesUseCases } from './use-cases/issues.use-cases';
import { IssuesController } from './issues.controller';
import { AtlassianModule } from 'src/common/atlassian/atlassian.module';

@Module({
  imports: [AtlassianModule],
  controllers: [IssuesController],
  providers: [IssuesUseCases],
})
export class IssuesModule {}
