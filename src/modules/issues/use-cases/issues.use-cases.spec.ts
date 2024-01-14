import { Test, TestingModule } from '@nestjs/testing';
import { IssuesUseCases } from './issues.use-cases';

describe('IssuesService', () => {
    let service: IssuesUseCases;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [IssuesUseCases],
        }).compile();

        service = module.get<IssuesUseCases>(IssuesUseCases);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
