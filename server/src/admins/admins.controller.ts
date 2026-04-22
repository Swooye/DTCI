import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { AdminsService } from './admins.service';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post('login')
  async login(@Body() loginDto: any) {
    return this.adminsService.login(loginDto);
  }

  @Get('health')
  async health() {
    return { status: 'ok', msg: 'AdminsController is active' };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log(`[AdminsController] findOne called with id: ${id}`);
    return this.adminsService.findOne(Number(id));
  }

  @Get()
  async findAll() {
    return this.adminsService.findAll();
  }

  @Post()
  async create(@Body() createDto: any) {
    return this.adminsService.create(createDto);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return this.adminsService.update(id, updateDto);
  }

  @Post(':id/change-password')
  async changePassword(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.adminsService.changePassword(id, body);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.adminsService.remove(id);
  }
}
