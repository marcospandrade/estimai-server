import { Test, TestingModule } from '@nestjs/testing';
import { IssuesController } from './issues.controller';
import { IssuesService } from './use-cases/issues.use-cases';

describe('IssuesController', () => {
    let controller: IssuesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [IssuesController],
            providers: [IssuesService],
        }).compile();

        controller = module.get<IssuesController>(IssuesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
