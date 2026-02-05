import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PdsModule } from './pds/pds.module';
import { Files201Module } from './files201/files201.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    // Loads environment variables from a .env file into process.env
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available throughout the application without needing to import it in other modules.
    }),
    // Provides rate limiting (to prevent abuse).
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: Number.parseInt(process.env.THROTTLE_TTL || '60000'), // time to live in milliseconds
        limit: Number.parseInt(process.env.THROTTLE_LIMIT || '100'), // max number of requests within the ttl
      },
    ]),
    PrismaModule, // Wraps Prisma ORM so you can query your database. Provides PrismaService for DB access.
    AuthModule, // Handles authentication (login, registration, JWT tokens, etc.).
    UsersModule, // Manages user data (CRUD operations on users).
    PdsModule, // Manages Personal Data Sheet (PDS) operations.
    Files201Module, // Manages 201 file operations.
  ],
  providers: [
    {
      provide: APP_GUARD, // Applies JWT authentication guard globally to all routes.
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD, // Applies rate limiting guard globally to all routes.
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (process.env.NODE_ENV !== 'production') {
      consumer.apply(LoggerMiddleware).forRoutes('*');
    }
  }
} // Root module of the application. It’s imported in main.ts (NestFactory.create(AppModule)).
