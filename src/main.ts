// src/main.ts
import { randomUUID } from 'crypto';

if (!globalThis.crypto) {
  (globalThis as any).crypto = {
    randomUUID: randomUUID
  };
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(3000);
  
}
console.log('🌱 Loaded ENV:');
console.log({
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DATABASE_URL: process.env.DATABASE_URL,
});
bootstrap();