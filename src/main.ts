require('newrelic');

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: [/127\.0\.0\.1$/, /localhost:\d+$/, /x86\.app$/],
    },
  });
  app.setGlobalPrefix('/api');

  // * Compress response: https://docs.nestjs.com/techniques/compression
  app.use(compression());

  // * Support large request body: https://stackoverflow.com/questions/52783959
  app.use(express.json({ limit: '50mb' }));

  // * Support X-Forwarded header: https://expressjs.com/en/guide/behind-proxies.html
  app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);

  const config = new DocumentBuilder()
    .setTitle(process.env.npm_package_name!)
    .setDescription(process.env.npm_package_description!)
    .setVersion(process.env.npm_package_version!)
    .addServer('https://api.sagasu.x86.app', 'production')
    .addServer('http://localhost:3000', 'development')
    .addBearerAuth({ type: 'http', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
