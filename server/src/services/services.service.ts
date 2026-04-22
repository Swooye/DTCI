import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ServiceCreateInput) {
    if (data.content) {
      data.image = this.processCoverFromContent(data.content, data.image as string, null);
    }
    return this.prisma.service.create({
      data,
    });
  }

  async findAll(category?: string) {
    const where: Prisma.ServiceWhereInput = {};
    if (category) {
      where.category = category;
    }
    return this.prisma.service.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.service.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Prisma.ServiceUpdateInput) {
    if (data.content) {
      const current = await this.prisma.service.findUnique({ where: { id } });
      data.image = this.processCoverFromContent(data.content as string, data.image as string, current?.image || null);
    }
    return this.prisma.service.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.service.delete({
      where: { id },
    });
  }

  /**
   * 从服务详情中智能提取封面图
   * 
   * @param content 服务详情 HTML
   * @param incomingImage 本次保存提交的封面图路径
   * @param originalImage 数据库中原有的封面图路径
   * @returns 最终确定的封面图路径
   */
  private processCoverFromContent(content: string, incomingImage: string | null, originalImage: string | null): string | null {
    // 1. 如果用户手动上传了图片，则以手动上传的为准
    if (incomingImage) {
      return incomingImage;
    }

    // 2. 如果用户显式删除了图片（即原有图片存在，但本次提交为 null），则尊重删除意图，不再提取
    if (!incomingImage && originalImage && incomingImage === null) {
      return null;
    }

    // 3. 否则，尝试从正文中提取第一张图片作为封面
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
    const match = imgRegex.exec(content);
    if (match && match[1]) {
      const src = match[1];
      // 统一处理路径
      return src.includes('://') ? new URL(src).pathname : src;
    }

    return incomingImage;
  }
}
