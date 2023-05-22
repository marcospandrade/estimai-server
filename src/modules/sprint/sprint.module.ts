import { Module } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { SprintController } from './sprint.controller';

@Module({
  controllers: [SprintController],
  providers: [SprintService]
})
export class SprintModule {}
