import { Controller, Get, UseGuards } from '@nestjs/common';

import { IssuesUseCases } from './use-cases/issues.use-cases';
import { CurrentUser } from '@common/current-user/current-user.decorator';
import { User } from '../auth/entities/auth.entity';
import { JwtAuthGuard } from '@modules/auth/strategies/jwt-bearer/jwt-auth.guard';

@Controller('issues')
@UseGuards(JwtAuthGuard)
export class IssuesController {
    constructor(private readonly issuesUseCases: IssuesUseCases) {}

    @Get()
    findAll(@CurrentUser() user: User) {
        return this.issuesUseCases.findAll(user);
    }
}
