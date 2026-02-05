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
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt.strategy';

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

      const isPasswordValid = await bcrypt.compare(password, account.password);

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
    const { email, password, firstName, lastName } = registerDto;

    try {
      const existingAccount = await this.prisma.account.findUnique({ where: { email } });

      if (existingAccount) {
        throw new ConflictException('Account with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

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

      // Create profile based on role if needed
      if (firstName || lastName) {
        // For now, we'll create staff profile if firstName/lastName provided
        // In production, role should be determined during registration
        const staffProfile = await this.prisma.staffProfile.create({
          data: {
            accountId: account.id,
          },
        });

        await this.prisma.staffData.create({
          data: {
            staffProfileId: staffProfile.id,
            firstName: firstName || null,
            lastName: lastName || null,
          },
        });
      }

      return {
        ...account,
        firstName,
        lastName,
      };
    } catch (error) {
      if (error?.code?.startsWith('P10') || error?.message?.includes('connect')) {
        throw new InternalServerErrorException('Database connection failed');
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    const account = await this.validateUser(loginDto.email, loginDto.password);

    if (!account) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(account);
    await this.saveRefreshToken(account.id, tokens.refreshToken);

    // Get profile info
    const profile = await this.getAccountProfile(account.id);

    return {
      user: {
        id: account.id,
        email: account.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        role: account.role,
      },
      ...tokens,
    };
  }

  /**
   * Get account profile (staff or school personnel)
   */
  private async getAccountProfile(accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: {
        staffProfile: {
          include: {
            staffData: true,
          },
        },
        schoolPersonnelProfile: {
          include: {
            schoolPersonnelData: true,
          },
        },
      },
    });

    if (!account) {
      return { firstName: null, lastName: null };
    }

    if (account.staffProfile?.staffData) {
      return {
        firstName: account.staffProfile.staffData.firstName,
        lastName: account.staffProfile.staffData.lastName,
      };
    }

    if (account.schoolPersonnelProfile?.schoolPersonnelData) {
      return {
        firstName: account.schoolPersonnelProfile.schoolPersonnelData.firstName,
        lastName: account.schoolPersonnelProfile.schoolPersonnelData.lastName,
      };
    }

    return { firstName: null, lastName: null };
  }

  async refreshTokens(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const session = await this.prisma.session.findUnique({
        where: { refreshToken },
        include: { account: true },
      });

      if (!session || session.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      if (!session.account.isActive) {
        throw new UnauthorizedException('Account is inactive');
      }

      const tokens = await this.generateTokens(session.account);

      // Delete old session and create new one
      await this.prisma.session.delete({ where: { id: session.id } });
      await this.saveRefreshToken(session.userId, tokens.refreshToken);

      // Get profile info
      const profile = await this.getAccountProfile(session.account.id);

      return {
        user: {
          id: session.account.id,
          email: session.account.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          role: session.account.role,
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

  async logout(refreshToken: string) {
    if (!refreshToken) {
      return { message: 'Logged out successfully' };
    }

    try {
      await this.prisma.session.deleteMany({
        where: { refreshToken },
      });

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
      await this.prisma.session.deleteMany({
        where: { userId },
      });

      return { message: 'Logged out from all devices successfully' };
    } catch (error) {
      if (error?.code?.startsWith('P10') || error?.message?.includes('connect')) {
        throw new InternalServerErrorException('Database connection failed');
      }
      throw error;
    }
  }

  private async generateTokens(user: any) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRATION');
    const expirationMs = this.parseExpiration(expiresIn);
    const expiresAt = new Date(Date.now() + expirationMs);

    try {
      await this.prisma.session.create({
        data: {
          userId,
          refreshToken,
          expiresAt,
        },
      });
    } catch (error) {
      if (error?.code?.startsWith('P10') || error?.message?.includes('connect')) {
        throw new InternalServerErrorException('Database connection failed');
      }
      throw error;
    }
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
      throw new Error('Invalid expiration format');
    }

    const [, value, unit] = match;
    return Number.parseInt(value) * units[unit];
  }
}
