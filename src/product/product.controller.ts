import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from '@common/dtos/page-options.dto';
import { PageDto } from '@common/dtos/page.dto';
import { Product } from '@product/entities/product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from '@minio-client/file.model';
import RoleGuard from '@auth/guards/role.guard';
import { Role } from '@common/enums/role.enum';

@ApiBearerAuth()
@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/all')
  async getAllProducts(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Product>> {
    return await this.productService.getProducts(pageOptionsDto);
  }

  @Get('/:id')
  async getProductById(@Param('id') id: string) {
    return await this.productService.getProduct(id);
  }

  @Post('/create')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDto })
  @ApiBody({
    description: 'A single image file with additional product data',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Product image file',
        },

        name: {
          type: 'string',
          description: 'Name of the product',
          example: 'IPhone16',
        },

        description: {
          type: 'string',
          description: 'Description of the product',
          example: 'This phone is good',
        },

        price: {
          type: 'number',
          description: 'Price of the product',
          example: '640000',
        },

        stock: {
          type: 'number',
          description: 'Stock of the product',
          example: '100',
        },

        category: {
          type: 'string',
          description: 'Category of product',
          example: 'Mobile',
        },
      },
    },
  })
  async registerProduct(
    @UploadedFile() productImg?: BufferedFile,
    @Body() createProductDto?: CreateProductDto,
  ) {
    return await this.productService.postProduct(productImg, createProductDto);
  }

  @Delete('delete')
  async deleteAllProducts() {
    return await this.productService.deleteProducts();
  }

  @Delete('/:id')
  async deleteProductById(@Param('id') id: string) {
    return await this.productService.deleteProductById(id);
  }

  @UseGuards(RoleGuard(Role.ADMIN))
  @Put('/:id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDto })
  @ApiBody({
    description: 'A single image file with additional product data',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Product image file',
        },

        name: {
          type: 'string',
          description: 'Name of the product',
          example: 'IPhone',
        },

        description: {
          type: 'string',
          description: 'Description of the product',
          example: 'This phone works well',
        },

        price: {
          type: 'number',
          description: 'Price of the product',
          example: '5000',
        },

        stock: {
          type: 'number',
          description: 'Stock of the product',
          example: '10',
        },
      },
    },
  })
  async updateProduct(
    @Param('id') id: string,
    @UploadedFile() productImg?: BufferedFile,
    @Body() updateProductDto?: CreateProductDto,
  ) {
    return await this.productService.updateProductById(
      id,
      productImg,
      updateProductDto,
    );
  }
}
