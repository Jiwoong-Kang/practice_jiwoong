import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { PageOptionsDto } from '@common/dtos/page-options.dto';
import { PageDto } from '@common/dtos/page.dto';
import { PageMetaDto } from '@common/dtos/page-meta.dto';
import { BufferedFile } from '@minio-client/file.model';
import { MinioClientService } from '@minio-client/minio-client.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly minioClientService: MinioClientService,
  ) {}

  async getProducts(pageOptionsDto: PageOptionsDto): Promise<PageDto<Product>> {
    // const products = await this.productRepository.find();
    // return { count: products.length, data: products };
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    queryBuilder
      .orderBy('product.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto<Product>(entities, pageMetaDto);
  }

  async getProduct(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async postProduct(image?: BufferedFile, createProductDto?: CreateProductDto) {
    const productImg = await this.minioClientService.createProductImg(
      image,
      'product',
      createProductDto.category,
    );
    const newProduct = await this.productRepository.create({
      productImg,
      ...createProductDto,
    });
    await this.productRepository.save(newProduct);
    return newProduct;
  }

  async deleteProducts() {
    const deleteResponse = await this.productRepository.delete({});
    if (!deleteResponse) {
      throw new HttpException('Something new Error', HttpStatus.NOT_FOUND);
    }
    return 'Everything got deleted';
  }

  async deleteProductById(id: string) {
    const deleteResponse = await this.productRepository.delete({ id });
    if (!deleteResponse) {
      throw new HttpException('Products not found', HttpStatus.NOT_FOUND);
    }
    return 'Selected product deleted';
  }

  async updateProductById(
    id: string,
    image?: BufferedFile,
    updateProductDto?: CreateProductDto,
  ) {
    const productImg = await this.minioClientService.uploadProductImg(
      id,
      image,
      'Product',
    );
    await this.productRepository.update(id, {
      ...updateProductDto,
      productImg,
    });
    const updatedProduct = await this.productRepository.findOneBy({ id });
    if (updatedProduct) {
      return updatedProduct;
    }
    throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
  }
}
