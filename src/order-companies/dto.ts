import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderCompaniesDto {
  @ApiProperty({
    example: 'cuid1',
    description: 'The unique identifier of the order company',
  })
  id: string;

  @ApiProperty({
    example: 'cuid2',
    description: 'The unique identifier of the order',
  })
  orderId: string;

  @ApiProperty({
    example: 'cuid3',
    description: 'The unique identifier of the contractor company',
  })
  contractorCompanyId: string;

  @ApiProperty({
    example: 'cuid4',
    description: 'The unique identifier of the subcontractor company, if any',
    required: false,
  })
  subcontractorCompanyId?: string;
}

export class CreateOrderCompaniesDto {
  @ApiProperty({
    example: 'cuid2',
    description: 'The unique identifier of the order',
  })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({
    example: 'cuid3',
    description: 'The unique identifier of the contractor company',
  })
  @IsNotEmpty()
  @IsString()
  contractorCompanyId: string;

  @ApiProperty({
    example: 'cuid4',
    description: 'The unique identifier of the subcontractor company, if any',
    required: false,
  })
  @IsOptional()
  @IsString()
  subcontractorCompanyId?: string;
}

export class UpdateOrderCompaniesDto {
  @ApiProperty({
    example: 'cuid2',
    description: 'The unique identifier of the order',
    required: false,
  })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiProperty({
    example: 'cuid3',
    description: 'The unique identifier of the contractor company',
    required: false,
  })
  @IsOptional()
  @IsString()
  contractorCompanyId?: string;

  @ApiProperty({
    example: 'cuid4',
    description: 'The unique identifier of the subcontractor company, if any',
    required: false,
  })
  @IsOptional()
  @IsString()
  subcontractorCompanyId?: string;
}
