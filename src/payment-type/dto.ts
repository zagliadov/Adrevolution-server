import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum CostUnit {
  PER_HOUR = 'PER_HOUR',
  PER_MONTH = 'PER_MONTH',
}

export class PaymentTypeDto {
  @IsString()
  @ApiProperty({ type: String, example: 'cuid1234567890' })
  id: string;

  @IsString()
  @Type(() => String)
  @ApiProperty({ type: String, required: false, example: '30.0' })
  labourCost?: string;

  @IsEnum(CostUnit)
  @ApiProperty({ enum: CostUnit, example: CostUnit.PER_HOUR })
  costUnit: CostUnit;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'cuid1234567890' })
  userId: string;
}

export class CreatePaymentTypeDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  @ApiProperty({ type: String, required: false, example: '25.5' })
  labourCost?: string;

  @IsOptional()
  @IsEnum(CostUnit)
  @ApiProperty({ enum: CostUnit, required: false, example: CostUnit.PER_HOUR })
  costUnit?: CostUnit;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'cuid1234567890' })
  userId: string;
}

export class UpdatePaymentTypeDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  @ApiProperty({ type: String, required: false, example: '30.0' })
  labourCost?: string;

  @IsOptional()
  @IsEnum(CostUnit)
  @ApiProperty({ enum: CostUnit, required: false, example: CostUnit.PER_MONTH })
  costUnit?: CostUnit;
}
