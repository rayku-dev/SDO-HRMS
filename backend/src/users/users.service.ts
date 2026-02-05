import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.account.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        employeeProfile: true,
        teacherProfile: {
          include: {
            teacherData: true,
          },
        },
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

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
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        teacherProfile: true,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (updateUserDto.email && updateUserDto.email !== account.email) {
      const existingAccount = await this.prisma.account.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingAccount) {
        throw new ConflictException('Email is already in use');
      }
    }

    // Update account
    await this.prisma.account.update({
      where: { id },
      data: {
        email: updateUserDto.email,
        role: updateUserDto.role,
        isActive: updateUserDto.isActive,
      },
    });

    // Update profile if firstName/lastName provided
    if (updateUserDto.firstName || updateUserDto.lastName) {
      if (account.role === 'TEACHER') {
        // Check if teacher profile exists
        const teacherProfile = await this.prisma.teacherProfile.findUnique({
          where: { accountId: id },
        });

        if (teacherProfile) {
          // Update existing teacher data or create if doesn't exist
          await this.prisma.teacherData.upsert({
            where: {
              teacherProfileId: teacherProfile.id,
            },
            update: {
              firstName: updateUserDto.firstName,
              lastName: updateUserDto.lastName,
            },
            create: {
              teacherProfileId: teacherProfile.id,
              firstName: updateUserDto.firstName,
              lastName: updateUserDto.lastName,
            },
          });
        } else {
          // Create teacher profile and data
          const newTeacherProfile = await this.prisma.teacherProfile.create({
            data: {
              accountId: id,
              teacherData: {
                create: {
                  firstName: updateUserDto.firstName,
                  lastName: updateUserDto.lastName,
                },
              },
            },
          });
        }
      } else {
        await this.prisma.employeeProfile.upsert({
          where: { accountId: id },
          update: {
            firstName: updateUserDto.firstName,
            lastName: updateUserDto.lastName,
          },
          create: {
            accountId: id,
            firstName: updateUserDto.firstName,
            lastName: updateUserDto.lastName,
          },
        });
      }
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const account = await this.prisma.account.findUnique({ where: { id } });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    await this.prisma.account.delete({ where: { id } });

    return { message: 'Account deleted successfully' };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const account = await this.prisma.account.findUnique({ where: { id: userId } });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      account.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    await this.prisma.account.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Invalidate all sessions for security
    await this.prisma.session.deleteMany({
      where: { userId },
    });

    return { message: 'Password changed successfully. Please login again.' };
  }

  async getUserSessions(userId: string) {
    return this.prisma.session.findMany({
      where: { userId },
      select: {
        id: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
