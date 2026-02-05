import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  /**
   * ConfigModule gives access to environment variables (like JWT secrets, expiration times). Already marked global in AppModule, but imported here for clarity.
   * PassportModule handles authentication strategies (like JWT, local username/password).
   * JwtModule is used to sign and verify JWT tokens.
   * PrismaModule provides database access via Prisma ORM.
   */
  imports: [ConfigModule, PassportModule, JwtModule.register({}), PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
