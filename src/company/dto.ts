import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompanyDto {
  @IsString()
  @ApiProperty()
  id?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  companyName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  websiteURL?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  companyEmail?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  street1?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  city?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  state?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  postCode?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  businessHoursId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  ownerId?: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  country?: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  timezone?: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  dateFormat?: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  timeFormat?: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  firstDayOfWeek?: string;
}
