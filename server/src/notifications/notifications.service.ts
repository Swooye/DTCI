import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return this.prisma.notification.findMany({
      where: {
        OR: [
          { userId },
          { userId: null }, // Global notifications
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnreadCount(userId: number) {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async markAsRead(id: number) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async create(data: { userId?: number; title: string; content: string; type?: string }) {
    return this.prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        content: data.content,
        type: data.type || 'system',
      },
    });
  }
}
