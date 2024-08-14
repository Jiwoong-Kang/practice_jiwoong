import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(7)
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  token: string;
}
