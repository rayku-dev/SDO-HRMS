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
        staffProfile: {
          include: {
            staffData: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        schoolPersonnelProfile: {
          include: {
            schoolPersonnelData: {
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
      throw new NotFoundException('Account not found');
    }

    const firstName =
      account.staffProfile?.staffData?.firstName ||
      account.schoolPersonnelProfile?.schoolPersonnelData?.firstName ||
      null;
    const lastName =
      account.staffProfile?.staffData?.lastName ||
      account.schoolPersonnelProfile?.schoolPersonnelData?.lastName ||
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
        schoolPersonnelProfile: true,
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
      if (account.role === 'SCHOOL_PERSONNEL') {
        // Check if school personnel profile exists
        const schoolPersonnelProfile = await this.prisma.schoolPersonnelProfile.findUnique({
          where: { accountId: id },
        });

        if (schoolPersonnelProfile) {
          // Update existing school personnel data or create if doesn't exist
          await this.prisma.schoolPersonnelData.upsert({
            where: {
              schoolPersonnelProfileId: schoolPersonnelProfile.id,
            },
            update: {
              firstName: updateUserDto.firstName,
              lastName: updateUserDto.lastName,
            },
            create: {
              schoolPersonnelProfileId: schoolPersonnelProfile.id,
              firstName: updateUserDto.firstName,
              lastName: updateUserDto.lastName,
            },
          });
        } else {
          // Create school personnel profile and data
          const newSchoolPersonnelProfile = await this.prisma.schoolPersonnelProfile.create({
            data: {
              accountId: id,
              schoolPersonnelData: {
                create: {
                  firstName: updateUserDto.firstName,
                  lastName: updateUserDto.lastName,
                },
              },
            },
          });
        }
      } else {
        // For staff roles (not SCHOOL_PERSONNEL)
        const staffProfile = await this.prisma.staffProfile.findUnique({
          where: { accountId: id },
        });

        if (staffProfile) {
          // Update existing staff data or create if doesn't exist
          await this.prisma.staffData.upsert({
            where: {
              staffProfileId: staffProfile.id,
            },
            update: {
              firstName: updateUserDto.firstName,
              lastName: updateUserDto.lastName,
            },
            create: {
              staffProfileId: staffProfile.id,
              firstName: updateUserDto.firstName,
              lastName: updateUserDto.lastName,
            },
          });
        } else {
          // Create staff profile and data
          await this.prisma.staffProfile.create({
            data: {
              accountId: id,
              staffData: {
                create: {
                  firstName: updateUserDto.firstName,
                  lastName: updateUserDto.lastName,
                },
              },
            },
          });
        }
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
