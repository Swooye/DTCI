import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Prisma } from '@prisma/client';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  create(@Body() data: Prisma.QuestionCreateInput) {
    return this.questionsService.create(data);
  }

  @Get()
  findAll(
    @Query('type') type?: string,
    @Query('geneType') geneType?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('operator') operator?: string,
    @Query('dateStart') dateStart?: string,
    @Query('dateEnd') dateEnd?: string,
  ) {
    const isStatusActive =
      status === 'true' ? true : status === 'false' ? false : undefined;
    return this.questionsService.findAll({
      type,
      geneType,
      status: isStatusActive,
      search,
      operator,
      dateStart,
      dateEnd,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.QuestionUpdateInput,
  ) {
    return this.questionsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.remove(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: boolean,
  ) {
    return this.questionsService.updateStatus(id, status);
  }
}
