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
    @Body() data: any,
  ) {
    if (data.authorId) data.authorId = Number(data.authorId);
    if (data.virtualLikes !== undefined) data.virtualLikes = Number(data.virtualLikes);
    if (data.virtualStars !== undefined) data.virtualStars = Number(data.virtualStars);
    // 允许更新 realLikes/realStars 以便管理员修正数据，但主要修改 virtualLikes
    if (data.realLikes !== undefined) data.realLikes = Number(data.realLikes);
    if (data.realStars !== undefined) data.realStars = Number(data.realStars);
    
    return this.casesService.update(id, data);
  }

  @Post(':id/interact')
  interact(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { type: 'like' | 'star', action: 'add' | 'remove' }
  ) {
    console.log(`[Interaction-API] Request for Case ID ${id}:`, JSON.stringify(body));
    return this.casesService.interact(id, body.type, body.action);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.casesService.remove(id);
  }
}
