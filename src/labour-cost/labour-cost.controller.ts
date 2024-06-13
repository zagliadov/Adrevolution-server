import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { LabourCostService } from './labour-cost.service';
import { LabourCostDto, UpdateLabourCostDto } from './dto';
import { LabourCost } from '@prisma/client';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('labour-cost')
export class LabourCostController {
  constructor(private labourCostService: LabourCostService) {}

  @Patch(':userId')
  async update(
    @Param('userId') userId: string,
    @Body() dto: UpdateLabourCostDto,
  ): Promise<LabourCost> {
    return this.labourCostService.updateLabourCost(userId, dto);
  }

  @Get(':userId')
  @ApiOkResponse({
    type: LabourCostDto,
  })
  findByUserId(@Param('userId') userId: string): Promise<LabourCostDto> {
    return this.labourCostService.getLabourCostByUserId(userId);
  }

  @Delete(':userId')
  async delete(@Param('userId') userId: string): Promise<LabourCost> {
    return this.labourCostService.deleteLabourCost(userId);
  }
}
