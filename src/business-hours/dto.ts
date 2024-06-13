import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BusinessHoursDto {
  @ApiProperty()
  @IsString()
  monday: string;

  @ApiProperty()
  @IsString()
  tuesday: string;

  @ApiProperty()
  @IsString()
  wednesday: string;

  @ApiProperty()
  @IsString()
  thursday: string;

  @ApiProperty()
  @IsString()
  friday: string;

  @ApiProperty()
  @IsString()
  saturday: string;

  @ApiProperty()
  @IsString()
  sunday: string;
}
