import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PermissionDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  userPositionId: string;

  @ApiProperty()
  @IsBoolean()
  isAdmin: boolean;
}

export class CreatePermissionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userPositionId: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isAdmin: boolean;
}

export class UpdatePermissionDto {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;
}
