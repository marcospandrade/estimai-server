import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AtlassianService } from './atlassian.service';
import { ConfigModule } from '../config/config.module';
import { PrismaModule } from 'src/shared/prisma/prisma.module';

@Module({
  imports: [ConfigModule, HttpModule, PrismaModule],
  providers: [AtlassianService],
  exports: [AtlassianService],
})
export class AtlassianModule {}
