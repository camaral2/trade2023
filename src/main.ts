import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import logger from './utils/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());

  const options = new DocumentBuilder()
    .setTitle('Project Trade2023')
    .setDescription('The Trade2023 API description')
    .setVersion('1.0')
    //.setBasePath('api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT, () => {
    logger.info(`Listening on PORT: ${PORT}`);
  });
}
bootstrap();
