import { Module } from '@nestjs/common';
import { IssuesUseCases } from './use-cases/issues.use-cases';
import { IssuesController } from './issues.controller';
import { AtlassianModule } from 'src/common/atlassian/atlassian.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AtlassianModule],
  controllers: [IssuesController],
  providers: [IssuesUseCases, JwtService],
})
export class IssuesModule {}
