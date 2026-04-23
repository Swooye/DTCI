import { Controller, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { DistributorsService } from './distributors.service';

@Controller('distributors')
export class DistributorsController {
  constructor(private readonly distributorsService: DistributorsService) {}

  @Post('apply')
  async apply(@Body() applyDto: any) {
    const { userId, ...rest } = applyDto;
    return this.distributorsService.apply(Number(userId), rest);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.distributorsService.findAll(query);
  }

  @Get('user/:userId')
  async getMyInfo(@Param('userId', ParseIntPipe) userId: number) {
    return this.distributorsService.getMyInfo(userId);
  }

  @Get('user/:userId/commissions')
  async getMyCommissions(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const l = limit ? parseInt(limit, 10) : 20;
    return this.distributorsService.getMyCommissions(userId, p, l);
  }
}
