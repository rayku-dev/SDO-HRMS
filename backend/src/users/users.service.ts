import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcryptjs from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { MailService } from '@/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, role, isActive, ...profileData } = createUserDto;

    const existingAccount = await this.prisma.account.findUnique({
      where: { email },
    });

    if (existingAccount) {
      throw new ConflictException('Email is already in use');
    }

    const tempPassword = password || this.generateTemporaryPassword();
    const hashedPassword = await bcryptjs.hash(tempPassword, 10);
    const employeeNumber = profileData.employeeNumber || (await this.generateEmployeeNumber());

    const createdAccount = await this.prisma.$transaction(async (tx) => {
      const account = await tx.account.create({
        data: {
          email,
          password: hashedPassword,
          role: role || 'EMPLOYEE',
          isActive: isActive !== undefined ? isActive : true,
          user: {
            create: {
              firstName: profileData.firstName || null,
              lastName: profileData.lastName || null,
              middleName: profileData.middleName || null,
              nameExtension: profileData.nameExtension || null,
              designation: profileData.designation || null,
              appointmentDate: profileData.appointmentDate
                ? new Date(profileData.appointmentDate)
                : null,
              schedule: profileData.schedule || null,
              appointment: profileData.appointment || null,
              jobTitle: profileData.jobTitle || null,
              unit: profileData.unit || null,
              supervisor: profileData.supervisor || null,
              hrHead: profileData.hrHead || null,
              approver: profileData.approver || null,
              employeeNumber,
            },
          },
        },
      });

      return account;
    });

    // Send email with temporary password
    try {
      if (createdAccount) {
        await this.mailService.sendTemporaryPassword(
          email,
          profileData.firstName,
          tempPassword,
          employeeNumber,
        );
      }
    } catch (error) {
      console.error(`[UsersService] Failed to send email to ${email}:`, error.message);
      // We don't throw here as the account is already created, but we log the error
    }

    const user = await this.findOne(createdAccount.id);
    return {
      ...user,
      temporaryPassword: tempPassword,
    };
  }

  private async generateEmployeeNumber(): Promise<string> {
    const now = new Date();
    // Get year, month, day in YYMMDD format
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const datePrefix = `${year}${month}${day}`;

    // Find the latest user created today with this prefix
    const lastUser = await this.prisma.user.findFirst({
      where: {
        employeeNumber: {
          startsWith: datePrefix,
        },
      },
      orderBy: {
        employeeNumber: 'desc',
      },
    });

    let sequence = 1;
    if (lastUser && lastUser.employeeNumber) {
      // Extract the last 3 digits and increment
      const lastSequence = parseInt(lastUser.employeeNumber.slice(-3));
      if (!isNaN(lastSequence)) {
        sequence = lastSequence + 1;
      }
    }

    // Format as YYMMDDXXX
    return `${datePrefix}${sequence.toString().padStart(3, '0')}`;
  }

  private generateTemporaryPassword(length = 10): string {
    const charset = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  async importUsers(users: any[]) {
    const results = {
      success: 0,
      failed: 0,
      details: [] as any[],
    };

    console.log(`[UsersService] Starting import of ${users.length} users`);

    for (const user of users) {
      try {
        console.log(`[UsersService] Processing user: ${user.email}`);

        // Normalize role for Prisma enum compatibility
        let role = user.role || 'SCHOOL_PERSONNEL';
        if (typeof role === 'string') {
          role = role.toUpperCase().trim().replace(/\s+/g, '_');
        }

        console.log(`[UsersService] Normalized role for ${user.email}: ${role}`);

        await this.create({
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
          middleName: user.middleName,
          nameExtension: user.nameExtension,
          designation: user.designation,
          appointmentDate: user.appointmentDate,
          schedule: user.schedule,
          appointment: user.appointment,
          jobTitle: user.jobTitle,
          unit: user.unit,
          supervisor: user.supervisor,
          hrHead: user.hrHead,
          approver: user.approver,
          role: role as any,
          isActive: true,
        });

        console.log(`[UsersService] Successfully created user: ${user.email}`);
        results.success++;
      } catch (error) {
        console.error(`[UsersService] Failed to create user ${user.email}:`, error.message);
        results.failed++;
        results.details.push({
          email: user.email,
          error: error.message,
        });
      }
    }

    console.log(
      `[UsersService] Import finished. Success: ${results.success}, Failed: ${results.failed}`,
    );
    return results;
  }

  async findAll() {
    const accounts = await this.prisma.account.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return accounts.map((account) => {
      const { password, ...accountInfo } = account;
      return {
        ...accountInfo,
        firstName: account.user?.firstName || null,
        lastName: account.user?.lastName || null,
        middleName: account.user?.middleName || null,
        nameExtension: account.user?.nameExtension || null,
        designation: account.user?.designation || null,
        appointmentDate: account.user?.appointmentDate || null,
        schedule: account.user?.schedule || null,
        appointment: account.user?.appointment || null,
        jobTitle: account.user?.jobTitle || null,
        unit: account.user?.unit || null,
        supervisor: account.user?.supervisor || null,
        hrHead: account.user?.hrHead || null,
        approver: account.user?.approver || null,
        employeeNumber: account.user?.employeeNumber || null,
      };
    });
  }

  async findOne(id: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const { password, ...accountInfo } = account;
    return {
      ...accountInfo,
      firstName: account.user?.firstName || null,
      lastName: account.user?.lastName || null,
      middleName: account.user?.middleName || null,
      nameExtension: account.user?.nameExtension || null,
      designation: account.user?.designation || null,
      appointmentDate: account.user?.appointmentDate || null,
      schedule: account.user?.schedule || null,
      appointment: account.user?.appointment || null,
      jobTitle: account.user?.jobTitle || null,
      unit: account.user?.unit || null,
      supervisor: account.user?.supervisor || null,
      hrHead: account.user?.hrHead || null,
      approver: account.user?.approver || null,
      employeeNumber: account.user?.employeeNumber || null,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        user: true,
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

    // Update account and user (profile) together
    await this.prisma.account.update({
      where: { id },
      data: {
        email: updateUserDto.email,
        role: updateUserDto.role,
        isActive: updateUserDto.isActive,
        user: {
          upsert: {
            update: {
              firstName: updateUserDto.firstName,
              lastName: updateUserDto.lastName,
              middleName: updateUserDto.middleName,
              nameExtension: updateUserDto.nameExtension,
              designation: updateUserDto.designation,
              appointmentDate: updateUserDto.appointmentDate
                ? new Date(updateUserDto.appointmentDate)
                : undefined,
              schedule: updateUserDto.schedule,
              appointment: updateUserDto.appointment,
              jobTitle: updateUserDto.jobTitle,
              unit: updateUserDto.unit,
              supervisor: updateUserDto.supervisor,
              hrHead: updateUserDto.hrHead,
              approver: updateUserDto.approver,
            },
            create: {
              firstName: updateUserDto.firstName || null,
              lastName: updateUserDto.lastName || null,
              middleName: updateUserDto.middleName || null,
              nameExtension: updateUserDto.nameExtension || null,
              designation: updateUserDto.designation || null,
              appointmentDate: updateUserDto.appointmentDate
                ? new Date(updateUserDto.appointmentDate)
                : null,
              schedule: updateUserDto.schedule || null,
              appointment: updateUserDto.appointment || null,
              jobTitle: updateUserDto.jobTitle || null,
              unit: updateUserDto.unit || null,
              supervisor: updateUserDto.supervisor || null,
              hrHead: updateUserDto.hrHead || null,
              approver: updateUserDto.approver || null,
            },
          },
        },
      },
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    const account = await this.prisma.account.findUnique({ where: { id } });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const updated = await this.prisma.account.update({
      where: { id },
      data: { isActive: !account.isActive },
    });

    const status = updated.isActive ? 'activated' : 'suspended';
    return { message: `Account ${status} successfully` };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const account = await this.prisma.account.findUnique({ where: { id: userId } });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const isPasswordValid = await bcryptjs.compare(
      changePasswordDto.currentPassword,
      account.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcryptjs.hash(changePasswordDto.newPassword, 10);

    await this.prisma.account.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        hasChangedPassword: true,
      },
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

  async resendTemporaryPassword(id: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const tempPassword = this.generateTemporaryPassword();
    const hashedPassword = await bcryptjs.hash(tempPassword, 10);

    await this.prisma.account.update({
      where: { id },
      data: {
        password: hashedPassword,
        hasChangedPassword: false,
      },
    });

    // Invalidate all existing sessions and refresh tokens to ensure user must re-login
    await Promise.all([
      this.prisma.session.deleteMany({ where: { userId: id } }),
      this.prisma.refreshToken.deleteMany({ where: { userId: id } }),
    ]);

    try {
      await this.mailService.sendTemporaryPassword(
        account.email,
        account.user?.firstName || 'User',
        tempPassword,
        account.user?.employeeNumber || 'N/A',
      );
    } catch (error) {
      console.error(
        `[UsersService] Failed to resend email to ${account.email}:`,
        error.message,
      );
      throw new InternalServerErrorException(
        'Failed to send email. Password was reset but notification failed.',
      );
    }

    return {
      message: 'New temporary password has been sent to ' + account.email,
      temporaryPassword: tempPassword,
    };
  }
}
