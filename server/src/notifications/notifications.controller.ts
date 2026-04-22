import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('my/:userId')
  findAll(@Param('userId') userId: string) {
    return this.notificationsService.findAll(+userId);
  }

  @Get('unread-count/:userId')
  getUnreadCount(@Param('userId') userId: string) {
    return this.notificationsService.getUnreadCount(+userId);
  }

  @Post(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(+id);
  }

  @Post()
  create(@Body() data: { userId?: number; title: string; content: string; type?: string }) {
    return this.notificationsService.create(data);
  }
}
