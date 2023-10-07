import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSprintDto } from '../dto/create-sprint.dto';
import { UpdateSprintDto } from '../dto/update-sprint.dto';
import { AtlassianService } from 'src/common/atlassian/atlassian.service';
import { AuthUseCase } from '../../auth/use-cases/auth.use-cases';

@Injectable()
export class SprintUseCases {
  public constructor(private atlassianService: AtlassianService, private readonly authUseCase: AuthUseCase) {}

  create(createSprintDto: CreateSprintDto) {
    return 'This action adds a new sprint';
  }

  async findAll(userEmail: string) {
    if (!userEmail) {
      throw new NotFoundException('Missing user id');
    }

    return this.atlassianService.genericAtlassianCall(
      'https://api.atlassian.com/oauth/token/accessible-resources',
      userEmail,
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} sprint`;
  }

  update(id: number, updateSprintDto: UpdateSprintDto) {
    return `This action updates a #${id} sprint`;
  }

  remove(id: number) {
    return `This action removes a #${id} sprint`;
  }
}
