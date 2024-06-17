import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompanyDetailsDto {
  @IsString()
  @ApiProperty()
  id: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: '2-3 people' })
  teamSize?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: '$0 - $50.000' })
  estimatedAnnualRevenue?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'Win more work' })
  topPriority?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'Home Theater' })
  industry?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'ChatGPT' })
  heardAboutUs?: string | null;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: String, required: false, example: false })
  displayBusinessHours?: boolean | null;
}

export class PatchCompanyDetailsDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: '2-3 people' })
  teamSize?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: '$0 - $50.000' })
  estimatedAnnualRevenue?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'Win more work' })
  topPriority?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'Home Theater' })
  industry?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'ChatGPT' })
  heardAboutUs?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: String, required: false, example: false })
  displayBusinessHours?: boolean;
}
