import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { config } from 'dotenv';

import { createSwaggerDocument } from './swagger.config';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');

  createSwaggerDocument(app);

  await app.listen(process.env.APP_PORT ?? 3000);
}

bootstrap().then(() => {
  console.log('app started');
});
