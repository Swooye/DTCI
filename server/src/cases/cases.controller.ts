import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, ParseBoolPipe } from '@nestjs/common';
import { CasesService } from './cases.service';
import { Prisma } from '@prisma/client';

@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  create(@Body() data: Prisma.CaseUncheckedCreateInput) {
    // Ensure authorId is correct type if it comes as string
    if (data.authorId) data.authorId = Number(data.authorId);
    return this.casesService.create(data);
  }

  @Get()
  findAll(
    @Query('tag') tag?: string,
    @Query('isRecommended') isRecommended?: string,
  ) {
    const recommended = isRecommended === 'true' ? true : isRecommended === 'false' ? false : undefined;
    return this.casesService.findAll(tag, recommended);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.casesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.CaseUncheckedUpdateInput,
  ) {
    if (data.authorId) data.authorId = Number(data.authorId);
    return this.casesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.casesService.remove(id);
  }
}
