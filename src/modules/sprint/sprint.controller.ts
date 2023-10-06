import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SprintService } from './use-cases/sprint.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from '../auth/entities/auth.entity';

@Controller('sprint')
export class SprintController {
  constructor(private readonly sprintService: SprintService) {}

  @Post()
  create(@Body() createSprintDto: CreateSprintDto) {
    return this.sprintService.create(createSprintDto);
  }

  @Get('/test')
  testSprint(@CurrentUser() user: User) {
    return this.sprintService.findAll(user.email);
  }

  @Get()
  findAll(@CurrentUser('email') id: string) {
    return this.sprintService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sprintService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSprintDto: UpdateSprintDto) {
    return this.sprintService.update(+id, updateSprintDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sprintService.remove(+id);
  }
}
