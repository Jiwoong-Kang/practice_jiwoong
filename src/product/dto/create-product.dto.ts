import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'cell phone' })
  name: string;
  @ApiProperty({ example: 'is expensive' })
  description: string;
  @ApiProperty({ example: 'express' })
  productImg?: string;
  @ApiProperty({ example: '8000' })
  price: number;
  @ApiProperty({ example: '45' })
  stock: number;
  @ApiProperty({ example: 'true' })
  isSale: boolean;
  @ApiProperty({ example: 'iphone' })
  category: string;
}
