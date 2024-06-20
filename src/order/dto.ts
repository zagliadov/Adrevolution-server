import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class OrderDto {
  @IsString()
  @ApiProperty({ type: String })
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  description: string;

  @IsEnum(OrderStatus)
  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ type: String, format: 'date-time' })
  startAt: Date;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ type: String, format: 'date-time' })
  endAt: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  meta: string;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  description: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  @ApiProperty({ enum: OrderStatus, required: false })
  status?: OrderStatus;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ type: String, format: 'date-time' })
  startAt: Date;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ type: String, format: 'date-time' })
  endAt: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  meta: string;
}

export class GetOrderDto {
  @IsString()
  @ApiProperty({ type: String })
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  description: string;

  @IsEnum(OrderStatus)
  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ type: String, format: 'date-time' })
  startAt: Date;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ type: String, format: 'date-time' })
  endAt: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  meta: string;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
