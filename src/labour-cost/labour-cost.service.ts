import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import {
  CostUnit,
  CreateLabourCostDto,
  LabourCostDto,
  UpdateLabourCostDto,
} from './dto';
import { $Enums, LabourCost } from '@prisma/client';

@Injectable()
export class LabourCostService {
  constructor(private db: DbService) {}

  async createLabourCost(dto: CreateLabourCostDto): Promise<LabourCost> {
    return this.db.labourCost.create({
      data: {
        labourCost: dto.labourCost ?? 0.0,
        costUnit: dto.costUnit ?? CostUnit.PER_HOUR,
        userId: dto.userId,
      },
    });
  }

  async updateLabourCost(userId: string, dto: UpdateLabourCostDto) {
    try {
      const existingRecord = await this.db.labourCost.findFirstOrThrow({
        where: { userId },
      });

      return this.db.labourCost.update({
        where: { id: existingRecord.id },
        data: {
          labourCost: dto.labourCost,
          costUnit: dto.costUnit,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `LabourCost with userId ${userId} not found`,
        );
      }
      throw error;
    }
  }

  async getLabourCostByUserId(userId: string): Promise<LabourCostDto> {
    const labourCost = await this.db.labourCost.findFirstOrThrow({
      where: { userId },
    });

    const costUnit =
      labourCost.costUnit === $Enums.CostUnit.PER_HOUR
        ? CostUnit.PER_HOUR
        : CostUnit.PER_MONTH;

    return {
      id: labourCost.id,
      labourCost: Number(labourCost.labourCost),
      costUnit,
      userId: labourCost.userId,
    };
  }

  async deleteLabourCost(userId: string): Promise<LabourCost> {
    try {
      return this.db.labourCost.delete({
        where: { id: userId }, // Use `id` to identify the record
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `LabourCost with userId ${userId} not found`,
        );
      }
      throw error;
    }
  }
}
