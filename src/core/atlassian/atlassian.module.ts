import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AtlassianService } from './atlassian.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [AtlassianService],
  exports: [AtlassianService],
})
export class AtlassianModule {}
