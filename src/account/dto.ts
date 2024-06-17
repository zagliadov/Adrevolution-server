import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class AccountDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  ownerId: string;

  @ApiProperty()
  @IsBoolean()
  isBlockingEnabled: boolean;
}

export class PatchAccountDto {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isBlockingEnabled?: boolean;
}
