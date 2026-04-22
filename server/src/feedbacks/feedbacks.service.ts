import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedbacksService {
  private readonly logger = new Logger(FeedbacksService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: { type: string; content: string; images?: string[]; contact?: string }) {
    this.logger.log(`Creating feedback for user ${userId}`);
    return this.prisma.feedback.create({
      data: {
        userId,
        type: data.type,
        content: data.content,
        images: JSON.stringify(data.images || []),
        contact: data.contact,
        status: 'pending',
      },
    });
  }

  async findMy(userId: number) {
    return this.prisma.feedback.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.feedback.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findAll() {
    return this.prisma.feedback.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async reply(id: number, replyContent: string) {
    const feedback = await this.prisma.feedback.update({
      where: { id },
      data: {
        replyContent,
        replyTime: new Date(),
        status: 'replied',
      },
      include: { user: true },
    });

    // Generate notification for user
    await this.prisma.notification.create({
      data: {
        userId: feedback.userId,
        title: '反馈回复通知',
        content: `您的反馈被管理员回复了：${replyContent}`,
        type: 'feedback_reply',
      },
    });

    return feedback;
  }

  async getPendingCount() {
    return this.prisma.feedback.count({
      where: { status: 'pending' },
    });
  }
}
