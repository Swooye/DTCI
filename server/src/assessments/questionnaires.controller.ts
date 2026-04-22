import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { QuestionnairesService } from './questionnaires.service';
import { Prisma } from '@prisma/client';

@Controller('questionnaires')
export class QuestionnairesController {
  constructor(private readonly questionnairesService: QuestionnairesService) {}

  @Post()
  async create(@Body() data: Prisma.QuestionnaireCreateInput) {
    try {
      return await this.questionnairesService.create(data);
    } catch (error) {
      console.error('Create Questionnaire Error:', error);
      throw error;
    }
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.questionnairesService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionnairesService.findOne(id);
  }

  @Patch('reorder')
  async reorder(@Body('updates') updates: { id: number; sortOrder: number }[]) {
    return this.questionnairesService.reorder(updates);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.QuestionnaireUpdateInput,
  ) {
    try {
      return await this.questionnairesService.update(id, data);
    } catch (error) {
      console.error(`Update Questionnaire Error (${id}):`, error);
      throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.questionnairesService.remove(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    return this.questionnairesService.updateStatus(id, status);
  }
}
