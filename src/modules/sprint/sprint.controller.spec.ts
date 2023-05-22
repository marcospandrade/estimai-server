import { Test, TestingModule } from '@nestjs/testing';
import { SprintController } from './sprint.controller';
import { SprintService } from './sprint.service';

describe('SprintController', () => {
  let controller: SprintController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SprintController],
      providers: [SprintService],
    }).compile();

    controller = module.get<SprintController>(SprintController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
