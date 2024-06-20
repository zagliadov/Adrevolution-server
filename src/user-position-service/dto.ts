import { IsEnum, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PositionType } from '@prisma/client';

export class PositionDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ enum: PositionType })
  @IsEnum(PositionType)
  name: PositionType;
}

export class CreatePositionDto {
  @ApiProperty({ enum: PositionType })
  @IsEnum(PositionType)
  @IsNotEmpty()
  name: PositionType;
}

export class UpdatePositionDto {
  @ApiProperty({ enum: PositionType })
  @IsEnum(PositionType)
  @IsOptional()
  name?: PositionType;
}

export class AssignUserToPositionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  positionId: string;
}
