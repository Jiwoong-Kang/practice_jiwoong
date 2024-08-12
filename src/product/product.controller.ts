import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/all')
  async getAllProducts() {
    return await this.productService.getProducts();
  }

  @Get('/:id')
  async getProductById(@Param('id') id: string) {
    return await this.productService.getProduct(id);
  }

  @Post('/create')
  async registerProduct(@Body() createProductDto: CreateProductDto) {
    return await this.productService.postProduct(createProductDto);
  }

  @Delete('delete')
  async deleteAllProducts() {
    return await this.productService.deleteProducts();
  }

  @Delete('/:id')
  async deleteProductById(@Param('id') id: string) {
    return await this.productService.deleteProductById(id);
  }

  @Put('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    return await this.productService.updateProductById(id, createProductDto);
  }
}
