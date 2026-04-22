import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSetting(key: string) {
    const setting = await this.prisma.setting.findUnique({
      where: { key },
    });
    if (!setting) return null;
    try {
      return JSON.parse(setting.value);
    } catch (e) {
      return setting.value;
    }
  }

  async updateSetting(key: string, value: any) {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    return this.prisma.setting.upsert({
      where: { key },
      update: { value: stringValue },
      create: { key, value: stringValue },
    });
  }
}
