import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ResourceType } from '@prisma/client';

export class ResourceDto {
  @IsString()
  @ApiProperty({ type: String })
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  name: string;

  @IsEnum(ResourceType)
  @ApiProperty({ enum: ResourceType })
  type: ResourceType;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, nullable: true })
  userId?: string | null;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  companyId: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: Object, required: false })
  additionalProperties?: any;
}

export class CreateResourceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  name: string;

  @IsOptional()
  @IsEnum(ResourceType)
  @ApiProperty({ enum: ResourceType, required: false })
  type?: ResourceType;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, nullable: true })
  userId?: string | null;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  companyId: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: Object, required: false })
  additionalProperties?: any;
}

export class GetResourceDto {
  @IsString()
  @ApiProperty({ type: String })
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  name: string;

  @IsEnum(ResourceType)
  @ApiProperty({ enum: ResourceType })
  type: ResourceType;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, nullable: true })
  userId?: string | null;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  companyId: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: Object, required: false })
  additionalProperties?: any;
}

export class UpdateResourceDto extends PartialType(CreateResourceDto) {}

export enum TransportCompanyType {
  FreightTransportCompany = 'Freight Transport Company',
  PassengerTransportCompany = 'Passenger Transport Company',
  LogisticsAndSupplyChainCompany = 'Logistics and Supply Chain Company',
  CourierAndDeliveryService = 'Courier and Delivery Service',
  MovingAndRelocationCompany = 'Moving and Relocation Company',
  MaritimeShippingCompany = 'Maritime Shipping Company',
  AirCargoCompany = 'Air Cargo Company',
  RailTransportCompany = 'Rail Transport Company',
  IntermodalTransportCompany = 'Intermodal Transport Company',
  PublicTransportCompany = 'Public Transport Company',
}
