import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GeneTypesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.geneType.create({
      data: {
        questionnaireId: data.questionnaireId,
        name: data.name,
        description: data.description,
        meaning: data.meaning,
        image: data.image,
        categories: data.categories || '[]',
        status: data.status ?? true,
        operator: data.operator,
      },
    });
  }

  async findAll(params: { search?: string; status?: string; dateStart?: string; dateEnd?: string; operator?: string }) {
    const { search, status, dateStart, dateEnd, operator } = params;
    
    let where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { meaning: { contains: search } },
      ];
      // Note: if user searches for ID, we map it
      if (!isNaN(Number(search))) {
        where.OR.push({ id: Number(search) });
      }
    }

    if (status !== undefined && status !== '') {
      where.status = status === '1' || status === 'true';
    }

    if (operator && operator !== '') {
      where.operator = operator;
    }

    if (dateStart || dateEnd) {
      where.updatedAt = {};
      if (dateStart) where.updatedAt.gte = new Date(dateStart);
      if (dateEnd) {
        const end = new Date(dateEnd);
        end.setHours(23, 59, 59, 999);
        where.updatedAt.lte = end;
      }
    }

    return this.prisma.geneType.findMany({
      where,
      include: {
        questionnaire: {
          select: {
            name: true,
          }
        }
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const geneType = await this.prisma.geneType.findUnique({
      where: { id },
    });
    if (!geneType) {
      throw new NotFoundException(`GeneType with ID ${id} not found`);
    }
    return geneType;
  }

  async update(id: number, data: any) {
    return this.prisma.geneType.update({
      where: { id },
      data: {
        questionnaireId: data.questionnaireId,
        name: data.name,
        description: data.description,
        meaning: data.meaning,
        image: data.image,
        categories: data.categories,
        status: data.status,
        operator: data.operator,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.geneType.delete({
      where: { id },
    });
  }

  async updateStatus(id: number, status: boolean) {
    return this.prisma.geneType.update({
      where: { id },
      data: { status },
    });
  }
}
