import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.QuestionCreateInput) {
    return this.prisma.question.create({
      data,
    });
  }

  async findAll(query?: {
    type?: string;
    geneType?: string;
    status?: boolean;
    search?: string;
    operator?: string;
    dateStart?: string;
    dateEnd?: string;
  }) {
    const where: Prisma.QuestionWhereInput = {};

    if (query?.type) {
      where.type = query.type;
    }
    if (query?.geneType) {
      where.geneType = query.geneType;
    }
    if (query?.status !== undefined) {
      where.status = query.status;
    }
    if (query?.search) {
      where.title = {
        contains: query.search,
      };
    }
    if (query?.operator) {
      where.operator = query.operator;
    }
    if (query?.dateStart || query?.dateEnd) {
      where.updatedAt = {};
      if (query.dateStart) {
        where.updatedAt.gte = new Date(query.dateStart);
      }
      if (query.dateEnd) {
        where.updatedAt.lte = new Date(query.dateEnd);
      }
    }

    return this.prisma.question.findMany({
      where,
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.question.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Prisma.QuestionUpdateInput) {
    return this.prisma.question.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.question.delete({
      where: { id },
    });
  }

  async updateStatus(id: number, status: boolean) {
    return this.prisma.question.update({
      where: { id },
      data: { status },
    });
  }
}
