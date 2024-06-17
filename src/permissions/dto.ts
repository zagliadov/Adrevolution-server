import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

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
