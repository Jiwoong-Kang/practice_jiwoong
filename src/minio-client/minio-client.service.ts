import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { ConfigService } from '@nestjs/config';
import { User } from '@user/entities/user.entity';
import { BufferedFile } from '@root/minio-client/file.model';
import * as crypto from 'crypto';

@Injectable()
export class MinioClientService {
  private readonly logger: Logger;
  private readonly baseBucket: string;

  public get client() {
    return this.minio.client;
  }

  constructor(
    private readonly minio: MinioService,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger('MinioStorageService');
    this.baseBucket = this.configService.get('MINIO_BUCKET');
  }

  public async uploadProfileImg(
    user: User,
    file: BufferedFile,
    categoryName: string,
    baseBucket: string = this.baseBucket,
  ) {
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      throw new HttpException(
        'Error uploading file type error',
        HttpStatus.BAD_REQUEST,
      );
    }

    const temp_filename = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(temp_filename)
      .digest('hex');

    const ext = file.originalName.substring(
      file.originalName.lastIndexOf('.'),
      file.originalName.length,
    );

    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': 1234,
    };

    const filename = hashedFileName + ext;
    const fileBuffer = file.buffer;
    const filePath = `${categoryName}/${user.id}/${filename}`;

    // 같은 이름이 존재할 시 삭제 로직
    if (`${categoryName}/${user.id}`.includes(user.id)) {
      await this.deleteFolderContents(
        this.baseBucket,
        `${categoryName}/${user.id}/`,
      );
    }

    // 파일 첨부
    this.client.putObject(
      baseBucket,
      filePath,
      fileBuffer,
      fileBuffer.length,
      metaData,
      function (err) {
        console.log('=======================', err);
        if (err) {
          throw new HttpException(
            'Error uploading processing error',
            HttpStatus.BAD_REQUEST,
          );
        }
      },
    );
    return `http://${this.configService.get('MINIO_ENDPOINT')}:${this.configService.get('MINIO_PORT')}/${this.configService.get('MINIO_BUCKET')}/${filePath}`;
  }

  public async createProductImg(
    file: BufferedFile,
    categoryName1: string,
    categoryName2: string,
    baseBucket: string = this.baseBucket,
  ) {
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      throw new HttpException(
        'Error uploading product file type error',
        HttpStatus.BAD_REQUEST,
      );
    }

    const temp_filename = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(temp_filename)
      .digest('hex');

    const ext = file.originalName.substring(
      file.originalName.lastIndexOf('.'),
      file.originalName.length,
    );

    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': 1234,
    };

    const filename = hashedFileName + ext;
    const fileBuffer = file.buffer;
    const filePath = `${categoryName1}/${categoryName2}/${filename}`;

    this.client.putObject(
      baseBucket,
      filePath,
      fileBuffer,
      fileBuffer.length,
      metaData,
      function (err) {
        console.log('+++++++++++++++++', err);
        if (err) {
          throw new HttpException(
            'Error uploading processing product error',
            HttpStatus.BAD_REQUEST,
          );
        }
      },
    );
    return `http://${this.configService.get('MINIO_ENDPOINT')}:${this.configService.get('MINIO_PORT')}/${this.configService.get('MINIO_BUCKET')}/${filePath}`;
  }

  public async uploadProductImg(
    id: string,
    file: BufferedFile,
    categoryName: string,
    baseBucket: string = this.baseBucket,
  ) {
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      throw new HttpException(
        'Error uploading product file type error',
        HttpStatus.BAD_REQUEST,
      );
    }

    const temp_filename = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(temp_filename)
      .digest('hex');

    const ext = file.originalName.substring(
      file.originalName.lastIndexOf('.'),
      file.originalName.length,
    );

    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': 1234,
    };

    const filename = hashedFileName + ext;
    const fileBuffer = file.buffer;
    const filePath = `${categoryName}/${id}/${filename}`;

    if (`${categoryName}/${id}`.includes(id)) {
      await this.deleteFolderContents(
        this.baseBucket,
        `${categoryName}/${id}/`,
      );
    }

    this.client.putObject(
      baseBucket,
      filePath,
      fileBuffer,
      fileBuffer.length,
      metaData,
      function (err) {
        console.log('+++++++++++++++++', err);
        if (err) {
          throw new HttpException(
            'Error uploading processing product error',
            HttpStatus.BAD_REQUEST,
          );
        }
      },
    );
    return `http://${this.configService.get('MINIO_ENDPOINT')}:${this.configService.get('MINIO_PORT')}/${this.configService.get('MINIO_BUCKET')}/${filePath}`;
  }

  public async deleteFolderContents(bucketName, folderPath) {
    const objectsList = [];
    const stream = await this.client.listObjects(bucketName, folderPath, true);
    for await (const obj of stream) {
      objectsList.push(obj.name);
    }

    if (objectsList.length > 0) {
      const deleteResult = await this.client.removeObjects(
        bucketName,
        objectsList,
      );
      console.log('Deleted objects', deleteResult);
    } else {
      console.log('No objects found to delete');
    }
  }
}
