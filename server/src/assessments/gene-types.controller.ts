import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GeneTypesService } from './gene-types.service';

@Controller('gene-types')
export class GeneTypesController {
  constructor(private readonly geneTypesService: GeneTypesService) {}

  @Post()
  create(@Body() createGeneTypeDto: any) {
    return this.geneTypesService.create(createGeneTypeDto);
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('dateStart') dateStart?: string,
    @Query('dateEnd') dateEnd?: string,
    @Query('operator') operator?: string,
  ) {
    return this.geneTypesService.findAll({ search, status, dateStart, dateEnd, operator });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.geneTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGeneTypeDto: any) {
    return this.geneTypesService.update(+id, updateGeneTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.geneTypesService.remove(+id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: boolean) {
    return this.geneTypesService.updateStatus(+id, status);
  }
}
