import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDefaultAdmin();
  }

  // 预设超级管理员账号
  private async seedDefaultAdmin() {
    const adminCount = await this.prisma.adminUser.count();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await this.prisma.adminUser.create({
        data: {
          username: 'admin',
          password: hashedPassword,
          name: '超级管理员',
          role: 'super_admin',
          status: true,
        },
      });
      console.log('Default admin account created: admin / admin123');
    }
  }

  async login(loginDto: any) {
    const { username, password } = loginDto;
    const admin = await this.prisma.adminUser.findUnique({
      where: { username },
    });

    if (!admin) {
      throw new UnauthorizedException('用户不存在');
    }

    if (!admin.status) {
      throw new UnauthorizedException('该账号已被禁用');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('密码错误');
    }

    // 更新最后登录时间
    await this.prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    });

    // 返回不包含密码的用户信息
    const { password: _, ...result } = admin;
    return result;
  }

  async findAll() {
    return this.prisma.adminUser.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        email: true,
        status: true,
        lastLogin: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(createDto: any) {
    const hashedPassword = await bcrypt.hash(createDto.password || '123456', 10);
    return this.prisma.adminUser.create({
      data: {
        ...createDto,
        password: hashedPassword,
      },
    });
  }

  async update(id: number, updateDto: any) {
    const data = { ...updateDto };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.adminUser.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    // 禁止删除唯一的超级管理员（简单防呆）
    const admin = await this.prisma.adminUser.findUnique({ where: { id } });
    if (admin?.username === 'admin') {
      throw new UnauthorizedException('不能删除默认超级管理员账号');
    }
    return this.prisma.adminUser.delete({ where: { id } });
  }
}
