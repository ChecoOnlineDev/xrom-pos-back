// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log', 'debug'],
    });

    // Habilitar cookie-parser para manejar cookies de la petición
    app.use(cookieParser());

    // Establecer un prefijo global para todas las rutas de la API
    app.setGlobalPrefix('api');

    // Habilitar la validación global de DTOs
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Remueve propiedades que no están en el DTO
            forbidNonWhitelisted: true, // Lanza un error si hay propiedades no permitidas
            transform: true, // Transforma los payloads a sus tipos DTO
        }),
    );

    // Configuración de Swagger para la documentación de la API
    const config = new DocumentBuilder()
        .setTitle('API de Gestión de Taller')
        .setDescription(
            'API para la gestión de servicios, clientes y ventas de XROM SYSTEMS.',
        )
        .setVersion('1.0')
        .addBearerAuth() // Añadir soporte para tokens JWT
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
        useGlobalPrefix: true,
        customSiteTitle: 'API TALLER',
    });

    // Configuración de CORS
    app.enableCors({
        origin: ['http://localhost:5173', ''],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    });

    const port = process.env.PORT ?? 3000;
    await app.listen(port, '0.0.0.0');
}
bootstrap();
