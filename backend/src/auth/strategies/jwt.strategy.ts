import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const account = await this.prisma.account.findUnique({
      where: { id: payload.sub },
      include: {
        employeeProfile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        teacherProfile: {
          include: {
            teacherData: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!account || !account.isActive) {
      throw new UnauthorizedException('Account not found or inactive');
    }

    // Extract firstName and lastName from profile
    const firstName =
      account.employeeProfile?.firstName ||
      account.teacherProfile?.teacherData?.firstName ||
      null;
    const lastName =
      account.employeeProfile?.lastName ||
      account.teacherProfile?.teacherData?.lastName ||
      null;

    return {
      id: account.id,
      email: account.email,
      firstName,
      lastName,
      role: account.role,
      isActive: account.isActive,
    };
  }
}
