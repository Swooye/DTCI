import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get(':key')
  async getSetting(@Param('key') key: string) {
    return this.settingsService.getSetting(key);
  }

  @Patch(':key')
  async updateSetting(@Param('key') key: string, @Body() data: { value: any }) {
    return this.settingsService.updateSetting(key, data.value);
  }
}
