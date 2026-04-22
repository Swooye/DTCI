import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CaseUncheckedCreateInput) {
    if (data.content) {
      data.images = this.processImagesFromContent(data.content, data.images as string || '[]', '[]');
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

  async update(id: number, data: any) {
    console.log(`[CasesService] Updating case ${id}:`, JSON.stringify(data));
    
    if (data.content) {
      // 获取当前已有的图片
      const currentCase = await this.prisma.case.findUnique({ where: { id } });
      const incomingImages = data.images === null ? '[]' : (data.images as string || currentCase?.images || '[]');
      
      // 传入原始图片列表，用于识别用户的显式删除操作
      data.images = this.processImagesFromContent(data.content as string, incomingImages, currentCase?.images || '[]');
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

  async interact(id: number, type: 'like' | 'star', action: 'add' | 'remove') {
    const field = type === 'like' ? 'realLikes' : 'realStars';
    const increment = action === 'add' ? 1 : -1;

    console.log(`[Interaction-Service] Executing: Case ${id}, Field ${field}, Increment ${increment}`);

    const updated = await this.prisma.case.update({
      where: { id },
      data: {
        [field]: {
          increment: increment,
        },
      },
      select: {
        id: true,
        virtualLikes: true,
        realLikes: true,
        virtualStars: true,
        realStars: true,
      }
    });

    console.log(`[Interaction-Service] Success: New ${field} for ID ${id} is ${updated[field]}`);
    return updated;
  }

  /**
   * 智能提取正文图片逻辑 (Smart Sync)
   * 
   * @param content 案例正文 HTML
   * @param incomingImagesJson 本次请求提交的图片列表 JSON
   * @param originalImagesJson 数据库中现有的图片列表 JSON
   * @returns 处理后的图片列表 JSON
   */
  private processImagesFromContent(content: string, incomingImagesJson: string, originalImagesJson: string): string {
    let incomingImages: string[] = [];
    let originalImages: string[] = [];
    
    try {
      incomingImages = JSON.parse(incomingImagesJson || '[]');
      originalImages = JSON.parse(originalImagesJson || '[]');
    } catch (e) {
      incomingImages = [];
      originalImages = [];
    }

    // 正则提取 <img> 标签的 src 属性
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let match;
    const extractedFromContent: string[] = [];

    while ((match = imgRegex.exec(content)) !== null) {
      const src = match[1];
      if (src) {
        // 统一处理路径（如果是全路径则只拿 pathname 部分，方便比对）
        const pathOnly = src.includes('://') ? new URL(src).pathname : src;
        extractedFromContent.push(pathOnly);
      }
    }

    // 智能合并逻辑：
    // 以传入的 incomingImages 为基准
    const result = [...incomingImages];

    extractedFromContent.forEach(path => {
      // 1. 检查是否已经在结果集中 (去重)
      const isAlreadyInResult = result.some(r => {
        const rPath = r.includes('://') ? new URL(r).pathname : r;
        return rPath === path;
      });
      if (isAlreadyInResult) return;

      // 2. 核心逻辑：判断该图片是否是用户“有意删除”的
      // 如果该图片原本在 originalImages 中，但却没有出现在 incomingImages 中，说明用户在前端手动删除了它。
      const wasInOriginal = originalImages.some(o => {
        const oPath = o.includes('://') ? new URL(o).pathname : o;
        return oPath === path;
      });

      const wasExplicitlyDeleted = wasInOriginal; // 因为如果它没在 incomingImages 里，但原先有，那就是删了

      // 如果不是显式删除的（即它是正文里新出现的），则将其加入结果集
      if (!wasExplicitlyDeleted) {
        result.push(path);
      }
    });

    return JSON.stringify(result);
  }
}
