import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Prisma } from '@prisma/client';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() data: Prisma.ServiceCreateInput) {
    return this.servicesService.create(data);
  }

  @Get()
  findAll(@Query('category') category?: string) {
    return this.servicesService.findAll(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.ServiceUpdateInput) {
    return this.servicesService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(+id);
  }
}
