import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum CostUnit {
  PER_HOUR = 'PER_HOUR',
  PER_MONTH = 'PER_MONTH',
}

export class LabourCostDto {
  @IsString()
  id: string;

  @IsNumber()
  @Type(() => Number)
  labourCost: number;

  @IsEnum(CostUnit)
  costUnit: CostUnit;

  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class CreateLabourCostDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  labourCost?: number;

  @IsOptional()
  @IsEnum(CostUnit)
  costUnit?: CostUnit;

  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class UpdateLabourCostDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  labourCost?: number;

  @IsOptional()
  @IsEnum(CostUnit)
  costUnit?: CostUnit;
}
