import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
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
  async findAll(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('dateStart') dateStart?: string,
    @Query('dateEnd') dateEnd?: string,
  ) {
    const isStatus = status === 'true' ? true : status === 'false' ? false : undefined;
    return this.adminsService.findAll(search, role, isStatus, dateStart, dateEnd);
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
