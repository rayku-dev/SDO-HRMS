/**
 * main.ts
 * ----------------------------------------
 * Application entry point.
 *
 * Responsibilities:
 * - Bootstraps the NestJS application
 * - Registers global middlewares (Helmet, Cookie Parser)
 * - Enables CORS configuration
 * - Applies global validation rules
 * - Sets global API prefix
 *
 * Environment Variables:
 * - PORT: Application port (default: 3001)
 * - FRONTEND_URL: Allowed CORS origin
 *
 * Author: Raymond Hernandez
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // Check if express app is already created
  const app = await NestFactory.create<NestExpressApplication>(AppModule); 

  // Serve static files for 201 file uploads (Note: Local filesystem is read-only on Vercel)
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // Security
  app.use(helmet()); 
  app.use(cookieParser()); 

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*', 
    credentials: true, 
  });

  // Global prefix
  app.setGlobalPrefix('api'); 

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: false, 
      transform: true, 
      transformOptions: {
        enableImplicitConversion: true, 
      },
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder() 
    .setTitle('Project API')
    .setDescription('Authentication and Users endpoints with access & refresh tokens')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Paste your access token here',
        in: 'header',
      },
      'access-token', 
    )
    .build();

  const document = SwaggerModule.createDocument(app, config); 
  SwaggerModule.setup('api-docs', app, document); 

  // If running in Vercel (serverless), we just init and return the underlying Express instance
  if (process.env.VERCEL) {
    await app.init();
    return app.getHttpAdapter().getInstance();
  } else {
    // Start locally
    await app.listen(process.env.PORT || 3001);
    console.log(`🚀 Application is running on: http://localhost:${process.env.PORT || 3001}/api`);
  }
}

// Vercel Serverless Function Handler
let cachedServer: any;
export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return cachedServer(req, res);
}

// Locally Boot
if (!process.env.VERCEL) {
  bootstrap();
}
