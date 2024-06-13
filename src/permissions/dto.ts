import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export enum PermissionLevel {
  LIMITED_WORKER = 'LIMITED_WORKER',
  WORKER = 'WORKER',
  DISPATCHER = 'DISPATCHER',
  MANAGER = 'MANAGER',
  CUSTOM = 'CUSTOM',
  COMPANY_OWNER = 'COMPANY_OWNER',
}

export class PermissionDto {
  @IsBoolean()
  @ApiProperty()
  isOwner: boolean;

  @IsBoolean()
  @ApiProperty()
  isAdmin: boolean;

  @IsString()
  @ApiProperty()
  level: string;
}
