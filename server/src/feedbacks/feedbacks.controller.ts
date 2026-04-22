import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Post()
  create(@Body() data: { userId: number; type: string; content: string; images?: string[]; contact?: string }) {
    // In a real app, userId would come from JWT. Using body temporarily for simplicity given the local dev context.
    return this.feedbacksService.create(data.userId, data);
  }

  @Get('my/:userId')
  findMy(@Param('userId') userId: string) {
    return this.feedbacksService.findMy(+userId);
  }

  @Get('pending-count')
  getPendingCount() {
    return this.feedbacksService.getPendingCount();
  }

  @Get()
  findAll() {
    return this.feedbacksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.feedbacksService.findOne(id);
  }

  @Post(':id/reply')
  reply(@Param('id', ParseIntPipe) id: number, @Body() data: { replyContent: string }) {
    return this.feedbacksService.reply(id, data.replyContent);
  }
}
