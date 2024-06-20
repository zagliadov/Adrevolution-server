import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompanyDto {
  @IsString()
  @ApiProperty({ type: String })
  id: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  name?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  phoneNumber?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  websiteURL?: string | null;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ type: String, required: false })
  email?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  street1?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  street2?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  city?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  state?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  postCode?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  businessHoursId?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  ownerId?: string | null;

  @IsOptional()
  @ApiProperty({ type: String, required: false })
  @IsString()
  country?: string | null;

  @IsOptional()
  @ApiProperty({ type: String, required: false })
  @IsString()
  timezone?: string | null;

  @IsOptional()
  @ApiProperty({ type: String, required: false })
  @IsString()
  dateFormat?: string | null;

  @IsOptional()
  @ApiProperty({ type: String, required: false })
  @IsString()
  timeFormat?: string | null;

  @IsOptional()
  @ApiProperty({ type: String, required: false })
  @IsString()
  firstDayOfWeek?: string | null;

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
  @ApiProperty({ type: Boolean, required: false, example: false })
  displayBusinessHours?: boolean | null;
}

export class PatchCompanyDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'NewCompany2' })
  name?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: '+1234567890' })
  phoneNumber?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    required: false,
    example: 'https://example.com',
  })
  websiteURL?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    required: false,
    example: 'company@example.com',
  })
  email?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: '123 Main St' })
  street1?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'Route 66' })
  street2?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'Anytown' })
  city?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'Anystate' })
  state?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: '69006D' })
  postCode?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'USA' })
  country?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'America/New_York' })
  timezone?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'MM/DD/YYYY' })
  dateFormat?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'HH:mm' })
  timeFormat?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'Monday' })
  firstDayOfWeek?: string | null;

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
  @ApiProperty({ type: Boolean, required: false, example: false })
  displayBusinessHours?: boolean | null;
}
