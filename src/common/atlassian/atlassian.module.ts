import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AtlassianService } from './atlassian.service';
import { PrismaModule } from 'src/shared/prisma/prisma.module';

@Module({
    imports: [HttpModule, PrismaModule],
    providers: [AtlassianService],
    exports: [AtlassianService],
})
export class AtlassianModule {}
