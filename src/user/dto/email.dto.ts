import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
  @IsString()
  @ApiProperty({ example: 'dnd0311@naver.com' })
  email: string;
}
