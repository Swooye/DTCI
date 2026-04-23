import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DistributorsService {
  constructor(private readonly prisma: PrismaService) {}

  async apply(userId: number, applyDto: any) {
    const existing = await this.prisma.distributor.findUnique({
      where: { userId }
    });

    if (existing) {
      throw new BadRequestException('User is already a distributor');
    }

    const { realName, phone, birthday, address, alipayAccount } = applyDto;
    
    if (!realName || !phone || !alipayAccount) {
      throw new BadRequestException('Name, phone, and alipay account are required');
    }

    const newDistributor = await this.prisma.distributor.create({
      data: {
        userId,
        realName,
        phone,
        birthday,
        address,
        alipayAccount,
        status: 'approved', // Auto approve as per requirement
      }
    });

    return newDistributor;
  }

  async getMyInfo(userId: number) {
    const distributor = await this.prisma.distributor.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            avatarUrl: true,
            nickname: true,
          }
        }
      }
    });

    if (!distributor) {
      return { isDistributor: false };
    }

    return {
      isDistributor: true,
      ...distributor
    };
  }

  async getMyCommissions(userId: number, page: number = 1, limit: number = 20) {
    const distributor = await this.prisma.distributor.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!distributor) {
      throw new NotFoundException('Distributor record not found');
    }

    const records = await this.prisma.commissionRecord.findMany({
      where: { distributorId: distributor.id },
      include: {
        sourceUser: {
          select: {
            avatarUrl: true,
            nickname: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.prisma.commissionRecord.count({
      where: { distributorId: distributor.id }
    });

    return {
      records,
      total,
      page,
      limit,
    };
  }

  async findAll(query: any) {
    const { keyword, status, page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    if (keyword) {
      where.OR = [
        { realName: { contains: keyword } },
        { phone: { contains: keyword } },
        { user: { nickname: { contains: keyword } } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.distributor.findMany({
        where,
        include: {
          user: {
            select: {
              nickname: true,
              avatarUrl: true,
              openid: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.distributor.count({ where }),
    ]);

    return {
      items,
      total,
      page: Number(page),
      limit: Number(limit),
    };
  }
}
