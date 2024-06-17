import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class BusinessHoursDto {
  @ApiProperty({
    example: '{"start": "09:00", "end": "17:00", "enabled": true}',
  })
  @IsString()
  monday: string;

  @ApiProperty({
    example: '{"start": "09:00", "end": "17:00", "enabled": true}',
  })
  @IsString()
  tuesday: string;

  @ApiProperty({
    example: '{"start": "09:00", "end": "17:00", "enabled": true}',
  })
  @IsString()
  wednesday: string;

  @ApiProperty({
    example: '{"start": "09:00", "end": "17:00", "enabled": true}',
  })
  @IsString()
  thursday: string;

  @ApiProperty({
    example: '{"start": "09:00", "end": "17:00", "enabled": true}',
  })
  @IsString()
  friday: string;

  @ApiProperty({
    example: '{"start": "09:00", "end": "17:00", "enabled": false}',
  })
  @IsString()
  saturday: string;

  @ApiProperty({
    example: '{"start": "09:00", "end": "17:00", "enabled": false}',
  })
  @IsString()
  sunday: string;
}

export class PatchBusinessHoursDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: '{"start": "09:00", "end": "17:00", "enabled": true}',
  })
  monday?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: '{"start": "09:00", "end": "17:00", "enabled": true}',
  })
  tuesday?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: '{"start": "09:00", "end": "17:00", "enabled": true}',
  })
  wednesday?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: '{"start": "09:00", "end": "17:00", "enabled": true}',
  })
  thursday?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: '{"start": "09:00", "end": "17:00", "enabled": true}',
  })
  friday?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: '{"start": "09:00", "end": "17:00", "enabled": false}',
  })
  saturday?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: '{"start": "09:00", "end": "17:00", "enabled": false}',
  })
  sunday?: string;
}
