import { ApiProperty } from '@nestjs/swagger';

export class CreateConsentDto {
  @ApiProperty({ default: true })
  overFourteen: boolean;

  @ApiProperty({ default: true })
  agreeOfTerm: boolean;

  @ApiProperty({ default: true })
  agreeOfPersonalInfo: boolean;

  @ApiProperty({ default: false })
  agreeOfMarketing: boolean;

  @ApiProperty({ default: false })
  agreeOfETC: boolean;
}
