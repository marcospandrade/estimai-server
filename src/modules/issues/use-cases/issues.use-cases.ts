import { BadRequestException, Injectable } from '@nestjs/common';
import { AtlassianService } from 'src/common/atlassian/atlassian.service';
import { User } from 'src/modules/auth/entities/auth.entity';

@Injectable()
export class IssuesUseCases {
  public constructor(private readonly atlassianService: AtlassianService) {}

  public async findAll({ cloudId, email }: User) {
    if (!cloudId || !email) {
      throw new BadRequestException('Error trying to get issues');
    }

    const getIssues = await this.atlassianService.getIssues(cloudId, email);

    return getIssues;
  }
}
