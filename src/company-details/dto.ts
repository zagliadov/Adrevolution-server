import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompanyDetailsDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  teamSize?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  estimatedAnnualRevenue?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  topPriority?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  industry?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  heardAboutUs?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  displayBusinessHours?: boolean;
}
