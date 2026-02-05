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
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // Creates the NestJS application instance. Loads your root AppModule (where all controllers, services, and modules are registered). Think of AppModule as the "wiring diagram" of your backend.

  // Serve static files for 201 file uploads
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // Security
  app.use(helmet()); // Adds HTTP headers to protect against common web vulnerabilities (XSS, clickjacking, etc.).
  app.use(cookieParser()); // Lets NestJS read cookies from incoming requests (needed for refresh tokens).

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allows your frontend (Next.js at localhost:3000) to talk to your backend (localhost:3001).
    credentials: true, // Allows cookies (refresh tokens) to be sent across domains.
  });

  // Global prefix
  app.setGlobalPrefix('api'); // Sets a global prefix for all routes (e.g., /api/users, /api/auth).

  // Validation
  app.useGlobalPipes(
    // Automatically validates DTOs (Data Transfer Objects) using class-validator
    new ValidationPipe({
      whitelist: true, // Strips out any properties that are not defined in the DTOs.
      forbidNonWhitelisted: false, // Allow extra properties for flexibility (PDS has many optional fields)
      transform: true, // Automatically converts payloads to the correct types (e.g., strings to numbers).
      transformOptions: {
        enableImplicitConversion: true, // Automatically convert types
      },
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder() // Builds the Swagger documentation configuration.
    .setTitle('Project API')
    .setDescription('Authentication and Users endpoints with access & refresh tokens')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Paste your access token here, Access token stored in sessionStorage',
        in: 'header',
      },
      'access-token', // name for scheme
    )
    .addCookieAuth(
      'refreshToken', // cookie name
      {
        type: 'apiKey',
        in: 'cookie',
        description: 'Paste your refresh token here. Refresh token stored in httpOnly cookie',
      },
      'refresh-token', // name for scheme
    )
    .build();

  const document = SwaggerModule.createDocument(app, config); // Generates the Swagger document based on the app's routes and the above config.
  SwaggerModule.setup('api-docs', app, document); // Sets up the Swagger UI at /api-docs endpoint.

  // Start the server
  await app.listen(process.env.PORT || 3001);
  console.log(`🚀 Application is running on: http://localhost:${process.env.PORT || 3001}/api`);
}

bootstrap();
