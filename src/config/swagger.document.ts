import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Jiwoong apis')
    .setDescription('Api groups')
    .setVersion('1.0')
    .addTag('Jiwoong')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api-docs', app, document);
};
