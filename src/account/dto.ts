import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class AccountDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
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
