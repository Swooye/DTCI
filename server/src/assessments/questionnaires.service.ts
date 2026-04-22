import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuestionnairesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.QuestionnaireCreateInput) {
    try {
      return await this.prisma.questionnaire.create({
        data,
      });
    } catch (error) {
      console.error('Prisma Create Questionnaire Error:', error);
      throw error;
    }
  }

  async findAll(status?: string) {
    const where: Prisma.QuestionnaireWhereInput = {};
    if (status) {
      where.status = status;
    }
    return this.prisma.questionnaire.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ],
    });
  }

  async findOne(id: number) {
    const questionnaire = await this.prisma.questionnaire.findUnique({
      where: { id },
    });

    if (!questionnaire || !questionnaire.questions) {
      return questionnaire;
    }

    try {
      const questionConfigs = JSON.parse(questionnaire.questions);
      const questionIds = questionConfigs.map((q: any) => q.id);

      // 批量查询所有题目详情
      const questionsData = await this.prisma.question.findMany({
        where: {
          id: {
            in: questionIds,
          },
        },
      });

      // 将详情合并回配置并按 sequence 排序
      const populatedQuestions = questionConfigs
        .map((config: any) => {
          const detail = questionsData.find((q) => q.id === config.id);
          if (!detail) return null;
          return {
            ...detail,
            sequence: config.sequence,
            scoreOverride: config.scoreOverride,
            // 解析内部 JSON 字段
            options: detail.options ? JSON.parse(detail.options) : [],
          };
        })
        .filter(Boolean)
        .sort((a: any, b: any) => a.sequence - b.sequence);

      return {
        ...questionnaire,
        questions: JSON.stringify(populatedQuestions),
      };
    } catch (error) {
      console.error(`Error populating questions for questionnaire ${id}:`, error);
      return questionnaire;
    }
  }

  async update(id: number, data: Prisma.QuestionnaireUpdateInput) {
    try {
      return await this.prisma.questionnaire.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error(`Prisma Update Questionnaire Error (${id}):`, error);
      throw error;
    }
  }

  async remove(id: number) {
    return this.prisma.questionnaire.delete({
      where: { id },
    });
  }

  async updateStatus(id: number, status: string) {
    return this.prisma.questionnaire.update({
      where: { id },
      data: { status },
    });
  }

  async reorder(updates: { id: number; sortOrder: number }[]) {
    const queries = updates.map((u) => 
      this.prisma.questionnaire.update({
        where: { id: u.id },
        data: { sortOrder: u.sortOrder }
      })
    );
    return this.prisma.$transaction(queries);
  }
}
