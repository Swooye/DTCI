import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CaseUncheckedCreateInput) {
    if (data.content) {
      data.images = this.processImagesFromContent(data.content, data.images as string);
    }
    return this.prisma.case.create({
      data,
      include: {
        author: true,
      },
    });
  }

  async findAll(tag?: string, isRecommended?: boolean) {
    const where: Prisma.CaseWhereInput = {};
    if (tag) where.tag = tag;
    if (isRecommended !== undefined) where.isRecommended = isRecommended;

    return this.prisma.case.findMany({
      where,
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.case.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
  }

  async update(id: number, data: Prisma.CaseUncheckedUpdateInput) {
    if (data.content) {
      // 获取当前已有的图片
      const currentCase = await this.prisma.case.findUnique({ where: { id } });
      const incomingImages = data.images === null ? '[]' : (data.images as string || currentCase?.images || '[]');
      data.images = this.processImagesFromContent(data.content as string, incomingImages);
    }
    
    return this.prisma.case.update({
      where: { id },
      data,
      include: {
        author: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.case.delete({
      where: { id },
    });
  }

  private processImagesFromContent(content: string, existingImagesJson: string): string {
    let images: string[] = [];
    try {
      images = JSON.parse(existingImagesJson || '[]');
    } catch (e) {
      images = [];
    }

    // 正则提取 <img> 标签的 src 属性
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let match;
    const extractedImages: string[] = [];

    while ((match = imgRegex.exec(content)) !== null) {
      const src = match[1];
      // 提取相对路径或绝对路径，如果是带域名的只提取路径部分
      if (src) {
        extractedImages.push(src);
      }
    }

    // 合并并去重
    const combined = [...images];
    extractedImages.forEach(img => {
      // 检查是否已存在（忽略域名差异，只比对路径）
      const pathOnly = img.includes('://') ? new URL(img).pathname : img;
      const isDuplicate = combined.some(existing => {
        const existingPath = existing.includes('://') ? new URL(existing).pathname : existing;
        return existingPath === pathOnly;
      });

      if (!isDuplicate) {
        combined.push(pathOnly);
      }
    });

    return JSON.stringify(combined);
  }
}
