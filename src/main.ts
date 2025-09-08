// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser()); // Usar cookie-parser globalmente

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.listen(3000);
}
bootstrap();
