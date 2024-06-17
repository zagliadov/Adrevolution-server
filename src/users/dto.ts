import { ApiProperty } from '@nestjs/swagger';
import { PermissionLevel } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum CostUnit {
  PER_HOUR = 'PER_HOUR',
  PER_MONTH = 'PER_MONTH',
}

export class BaseUserDto {
  @ApiProperty({ example: 'clxa2aljj0000ophlkrpc1gki' })
  id: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ type: String, required: false })
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  firstName?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  lastName?: string | null;

  @IsOptional()
  @IsDate()
  @ApiProperty({ type: String, format: 'date-time', required: false })
  lastLogin: Date | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  streetAddress?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  city?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  province?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  postalCode?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  country?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  phoneNumber?: string | null;
}

export class UserDto extends BaseUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  companyId?: string | null;
}

export class UserSecretDto extends BaseUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  hash: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  salt: string;
}
export class PatchUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'Daniil' })
  firstName?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'Zahliadov' })
  lastName?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: '123 Main St' })
  streetAddress?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'New York' })
  city?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'New Province' })
  province?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: '69904E' })
  postalCode?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'USA' })
  country?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: '+1234567890' })
  phoneNumber?: string | null;
}

export class UserWithoutPassword {
  @ApiProperty({ example: 'clxa2aljj0000ophlkrpc1gki' })
  id: string;

  @ApiProperty({ example: 'a.a.t.a.trade@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: '123 Main St' })
  streetAddress?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'JohnCity' })
  city?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'JohnProvince' })
  province?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: '67008T' })
  postalCode?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'USA' })
  country?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: '+1234567890' })
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    required: false,
    example: 'clxean62l000487898922wqk5',
  })
  companyId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ type: Number, required: false, example: 20 })
  labourCost?: number;

  @IsOptional()
  @IsEnum(CostUnit)
  @ApiProperty({ enum: CostUnit, required: false, example: CostUnit.PER_HOUR })
  costUnit?: CostUnit;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false, example: true })
  surveys?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false, example: false })
  isAdmin?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({
    enum: PermissionLevel,
    required: false,
    example: PermissionLevel.WORKER,
  })
  permissionLevel?: PermissionLevel;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'Daniil' })
  inviterFirstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false, example: 'Zahliadov' })
  inviterLastName?: string;
}

export class VerificationTokenDto {
  @ApiProperty({ example: 'clxa2aljj0000ophlkrpc1gki' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'verification-token' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'clxa2aljj0000ophlkrpc1gki' })
  @IsString()
  userId: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  createdAt: Date;
}
