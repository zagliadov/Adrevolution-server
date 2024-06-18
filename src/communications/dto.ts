import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CommunicationDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsBoolean()
  surveys: boolean;

  @IsBoolean()
  errorMessages: boolean;
}

export class UpdateCommunicationDto {
  @IsBoolean()
  @ApiProperty({ example: true })
  surveys?: boolean;

  @IsBoolean()
  @ApiProperty({ example: true })
  errorMessages?: boolean;
}
