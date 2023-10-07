import { Test, TestingModule } from '@nestjs/testing';
import { AtlassianService } from './atlassian.service';

describe('AtlassianService', () => {
  let service: AtlassianService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtlassianService],
    }).compile();

    service = module.get<AtlassianService>(AtlassianService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
