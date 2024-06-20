import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UserNotificationSettingsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'cuid1234567890' })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'cuid1234567890' })
  userId: string;

  @IsBoolean()
  @ApiProperty({ type: Boolean, example: true })
  surveys: boolean;

  @IsBoolean()
  @ApiProperty({ type: Boolean, example: true })
  errorMessages: boolean;
}

export class UpdateUserNotificationSettingsDto {
  @IsBoolean()
  @ApiProperty({ type: Boolean, example: true })
  surveys?: boolean;

  @IsBoolean()
  @ApiProperty({ type: Boolean, example: true })
  errorMessages?: boolean;
}
