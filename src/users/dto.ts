import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PermissionLevel } from 'src/permissions/dto';

export enum CostUnit {
  PER_HOUR = 'PER_HOUR',
  PER_MONTH = 'PER_MONTH',
}
export class UserDto {
  @ApiProperty({
    example: 'clxa2aljj0000ophlkrpc1gki',
  })
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ type: String, format: 'date-time' })
  lastLogin: Date;

  @ApiProperty()
  streetAddress?: string;

  @ApiProperty()
  city?: string;

  @ApiProperty()
  province?: string;

  @ApiProperty()
  postalCode?: string;

  @ApiProperty()
  country?: string;

  @ApiProperty()
  phoneNumber?: string;
}

export class PatchUserDto {
  @ApiProperty()
  firstName?: string;

  @ApiProperty()
  lastName?: string;

  @ApiProperty()
  streetAddress?: string;

  @ApiProperty()
  city?: string;

  @ApiProperty()
  province?: string;

  @ApiProperty()
  postalCode?: string;

  @ApiProperty()
  country?: string;

  @ApiProperty()
  phoneNumber?: string;
}

export class UserWithoutPassword {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  streetAddress?: string;

  @ApiProperty()
  city?: string;

  @ApiProperty()
  province?: string;

  @ApiProperty()
  postalCode?: string;

  @ApiProperty()
  country?: string;

  @ApiProperty()
  phoneNumber?: string;

  @ApiProperty()
  companyId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  labourCost?: number;

  @IsOptional()
  @IsEnum(CostUnit)
  costUnit?: CostUnit;

  @IsBoolean()
  surveys?: boolean;

  @IsBoolean()
  @ApiProperty()
  isAdmin?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ enum: PermissionLevel, default: PermissionLevel.WORKER })
  permissionLevel?: PermissionLevel;

  @IsString()
  @IsOptional()
  @ApiProperty()
  inviterFirstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  inviterLastName?: string;
}
