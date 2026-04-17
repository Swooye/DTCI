import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { keyword?: string; gender?: string; status?: string }) {
    const where: any = {};

    console.log('Fetching users with query:', query);

    if (query.keyword && query.keyword.trim() !== '') {
      where.OR = [
        { nickname: { contains: query.keyword } },
        { phone: { contains: query.keyword } },
        { openid: { contains: query.keyword } },
      ];
    }

    if (query.gender && query.gender !== 'all' && query.gender !== '') {
      where.gender = query.gender;
    }

    // 获取用户列表，并包含订单数量统计
    const users = await this.prisma.user.findMany({
      where,
      include: {
        _count: {
          select: { orders: true, assessments: true },
        },
        orders: {
          select: { amount: true },
          where: { status: 'paid' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 计算每个用户的付费总额
    return users.map((user) => {
      const totalPaid = user.orders.reduce((sum, order) => sum + order.amount, 0);
      const { orders, ...userData } = user;
      return {
        ...userData,
        totalPaid,
      };
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orders: true, assessments: true },
        },
      },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.user.update({
      where: { id },
      data: {
        nickname: data.nickName,
        avatarUrl: data.avatar,
        gender: data.gender,
        city: data.city,
        phone: data.phone,
      },
    });
  }
}
