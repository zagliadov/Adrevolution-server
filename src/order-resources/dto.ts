import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderResourcesDto {
  @ApiProperty({
    example: 'cuid1',
    description: 'The unique identifier of the order resource',
  })
  id: string;

  @ApiProperty({
    example: 'cuid2',
    description: 'The unique identifier of the order',
  })
  orderId: string;

  @ApiProperty({
    example: 'cuid3',
    description: 'The unique identifier of the resource',
  })
  resourceId: string;
}

export class CreateOrderResourcesDto {
  @ApiProperty({
    example: 'cuid2',
    description: 'The unique identifier of the order',
  })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({
    example: 'cuid3',
    description: 'The unique identifier of the resource',
  })
  @IsNotEmpty()
  @IsString()
  resourceId: string;
}

export class UpdateOrderResourcesDto {
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
    description: 'The unique identifier of the resource',
    required: false,
  })
  @IsOptional()
  @IsString()
  resourceId?: string;
}
