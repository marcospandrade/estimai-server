import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { CurrentUser } from '@common/current-user/current-user.decorator';
import { SprintUseCases } from './use-cases/sprint.use-cases';
import { IUser } from '@modules/auth/entities/user.entity';

@Controller('sprint')
export class SprintController {
    constructor(private readonly sprintUseCases: SprintUseCases) {}

    @Post()
    create(@Body() createSprintDto: CreateSprintDto) {
        return this.sprintUseCases.create(createSprintDto);
    }

    @Get('/test')
    testSprint(@CurrentUser() user: IUser) {
        console.log('result controller', user);
        return this.sprintUseCases.findAll(user.email);
    }

    @Get()
    findAll(@CurrentUser() user: IUser) {
        console.log('result controller', user);
        return this.sprintUseCases.findAll(user.email);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.sprintUseCases.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSprintDto: UpdateSprintDto) {
        return this.sprintUseCases.update(+id, updateSprintDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.sprintUseCases.remove(+id);
    }
}
