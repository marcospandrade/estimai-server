import { Test, TestingModule } from '@nestjs/testing';
import { AuthFactoryService } from './auth-factory.service';

describe('AuthService', () => {
  let service: AuthFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthFactoryService],
    }).compile();

    service = module.get<AuthFactoryService>(AuthFactoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
