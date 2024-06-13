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
  surveys?: boolean;

  @IsBoolean()
  errorMessages?: boolean;
}
