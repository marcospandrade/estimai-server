import { Controller, Get, UseGuards } from '@nestjs/common';
import { IssuesUseCases } from './use-cases/issues.use-cases';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { CurrentUser } from '@common/current-user/current-user.decorator';
import { User } from '../auth/entities/auth.entity';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesUseCases: IssuesUseCases) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(@CurrentUser() user: User) {
    return this.issuesUseCases.findAll(user);
  }
}
