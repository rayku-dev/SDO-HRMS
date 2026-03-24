import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcryptjs from 'bcryptjs';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  sessionId: string;
  hasChangedPassword: boolean;
  type: 'access' | 'refresh';
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const account = await this.prisma.account.findUnique({ where: { email } });

      if (!account) {
        return null;
      }

      const isPasswordValid = await bcryptjs.compare(password, account.password);

      if (!isPasswordValid) {
        return null;
      }

      if (!account.isActive) {
        throw new UnauthorizedException('Account is inactive');
      }

      const { password: _, ...result } = account;
      return result;
    } catch (error) {
      if (error?.code?.startsWith('P10') || error?.message?.includes('connect')) {
        throw new InternalServerErrorException('Database connection failed');
      }
      throw error;
    }
  }

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, middleName, nameExtension } = registerDto;

    try {
      const existingAccount = await this.prisma.account.findUnique({ where: { email } });

      if (existingAccount) {
        throw new ConflictException('Account with this email already exists');
      }

      const hashedPassword = await bcryptjs.hash(password, 10);

      const account = await this.prisma.account.create({
        data: {
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      // Create profile (User)
      await this.prisma.user.create({
        data: {
          accountId: account.id,
          firstName: firstName || null,
          lastName: lastName || null,
          middleName: middleName || null,
          nameExtension: nameExtension || null,
        },
      });

      return {
        ...account,
        firstName,
        lastName,
        middleName,
        nameExtension,
      };
    } catch (error) {
      if (error?.code?.startsWith('P10') || error?.message?.includes('connect')) {
        throw new InternalServerErrorException('Database connection failed');
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto, userAgent?: string, ipAddress?: string) {
    const account = await this.validateUser(loginDto.email, loginDto.password);

    if (!account) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Clean up old sessions and refresh tokens (Layer 3 & 2)
    await Promise.all([
      this.prisma.session.updateMany({
        where: { userId: account.id, isActive: true },
        data: { isActive: false },
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId: account.id, revoked: false },
        data: { revoked: true },
      }),
    ]);

    // Create session (Layer 3)
    const sessionToken = this.generateSessionToken();
    const session = await this.prisma.session.create({
      data: {
        userId: account.id,
        sessionToken,
        expiresAt: this.getSessionExpiry(),
        userAgent,
        ipAddress,
        isActive: true,
      },
    });

    // Generate Tokens (Layer 1 & 2)
    const tokens = await this.generateTokens(account, session.id);
    await this.saveRefreshToken(account.id, tokens.refreshToken, userAgent, ipAddress);

    // Get profile info
    const profile = await this.getAccountProfile(account.id);

    return {
      user: {
        id: account.id,
        email: account.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        middleName: profile.middleName,
        nameExtension: profile.nameExtension,
        role: account.role,
        hasChangedPassword: account.hasChangedPassword,
      },
      ...tokens,
      sessionToken,
    };
  }

  private async getAccountProfile(accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: {
        user: true,
      },
    });

    if (!account || !account.user) {
      return { firstName: null, lastName: null, middleName: null, nameExtension: null };
    }

    return {
      firstName: account.user.firstName,
      lastName: account.user.lastName,
      middleName: account.user.middleName,
      nameExtension: account.user.nameExtension,
    };
  }

  async refreshTokens(refreshToken: string, userAgent?: string, ipAddress?: string) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      }) as TokenPayload;

      const tokenRecord = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { account: true },
      });

      if (!tokenRecord || tokenRecord.revoked || tokenRecord.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      if (!tokenRecord.account.isActive) {
        throw new UnauthorizedException('Account is inactive');
      }

      // Check if there's an active session
      const activeSession = await this.prisma.session.findFirst({
        where: { userId: tokenRecord.userId, isActive: true },
      });

      if (!activeSession) {
        throw new UnauthorizedException('Session expired');
      }

      // Revoke old token
      await this.prisma.refreshToken.update({
        where: { id: tokenRecord.id },
        data: { revoked: true },
      });

      // Generate new tokens
      const tokens = await this.generateTokens(tokenRecord.account, activeSession.id);
      await this.saveRefreshToken(tokenRecord.userId, tokens.refreshToken, userAgent, ipAddress);

      const profile = await this.getAccountProfile(tokenRecord.account.id);

      return {
        user: {
          id: tokenRecord.account.id,
          email: tokenRecord.account.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          role: tokenRecord.account.role,
          hasChangedPassword: tokenRecord.account.hasChangedPassword,
        },
        ...tokens,
      };
    } catch (error) {
      if (error?.code?.startsWith('P10') || error?.message?.includes('connect')) {
        throw new InternalServerErrorException('Database connection failed');
      }
      if (error?.status) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(refreshToken: string, sessionToken?: string) {
    try {
      const promises: any[] = [];
      if (refreshToken) {
        promises.push(this.prisma.refreshToken.updateMany({
          where: { token: refreshToken },
          data: { revoked: true },
        }));
      }
      if (sessionToken) {
        promises.push(this.prisma.session.updateMany({
          where: { sessionToken },
          data: { isActive: false },
        }));
      }
      await Promise.all(promises);
      return { message: 'Logged out successfully' };
    } catch (error) {
      if (error?.code?.startsWith('P10') || error?.message?.includes('connect')) {
        throw new InternalServerErrorException('Database connection failed');
      }
      throw error;
    }
  }

  async logoutAll(userId: string) {
    try {
      await Promise.all([
        this.prisma.refreshToken.updateMany({
          where: { userId },
          data: { revoked: true },
        }),
        this.prisma.session.updateMany({
          where: { userId },
          data: { isActive: false },
        }),
      ]);

      return { message: 'Logged out from all devices successfully' };
    } catch (error) {
      if (error?.code?.startsWith('P10') || error?.message?.includes('connect')) {
        throw new InternalServerErrorException('Database connection failed');
      }
      throw error;
    }
  }

  private async generateTokens(user: any, sessionId: string) {
    const payload: Partial<TokenPayload> = {
      sub: user.id,
      email: user.email,
      role: user.role,
      sessionId,
      hasChangedPassword: user.hasChangedPassword,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ ...payload, type: 'access' }, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
      }),
      this.jwtService.signAsync({ ...payload, type: 'refresh' }, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, token: string, userAgent?: string, ipAddress?: string) {
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRATION');
    const expirationMs = this.parseExpiration(expiresIn);
    const expiresAt = new Date(Date.now() + expirationMs);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
        userAgent,
        ipAddress,
      },
    });
  }

  private generateSessionToken(): string {
    return crypto.randomBytes(48).toString('hex');
  }

  private getSessionExpiry(): Date {
    const sessionExpiration = this.configService.get<string>('SESSION_EXPIRATION') || '24h';
    return new Date(Date.now() + this.parseExpiration(sessionExpiration));
  }

  private parseExpiration(expiration: string): number {
    const units: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    const match = expiration.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 24 * 60 * 60 * 1000; // Default 24h
    }

    const [, value, unit] = match;
    return Number.parseInt(value) * units[unit];
  }
}
