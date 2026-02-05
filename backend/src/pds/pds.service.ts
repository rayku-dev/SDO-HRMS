import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePdsDto } from './dto/create-pds.dto';
import { UpdatePdsDto } from './dto/update-pds.dto';
import { PDFService } from './pdf.service';
import {
  populateTeacherProfile,
  populateEmployeeProfile,
} from '@/lib/helpers/pds-extractors';

@Injectable()
export class PdsService {
  constructor(
    private prisma: PrismaService,
    private pdfService: PDFService,
  ) {}

  async create(createPdsDto: CreatePdsDto) {
    // Check if PDS already exists for this user
    const existingPds = await this.prisma.pds.findUnique({
      where: { userId: createPdsDto.userId },
    });

    if (existingPds) {
      throw new BadRequestException('PDS already exists for this user');
    }

    // Check if account exists
    const account = await this.prisma.account.findUnique({
      where: { id: createPdsDto.userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const pds = await this.prisma.pds.create({
      data: {
        userId: createPdsDto.userId,
        personalData: createPdsDto.personalData,
        familyData: createPdsDto.familyData,
        educationalData: createPdsDto.educationalData,
        civilServiceData: createPdsDto.civilServiceData || null,
        workExperienceData: createPdsDto.workExperienceData || null,
        voluntaryWorkData: createPdsDto.voluntaryWorkData || null,
        trainingProgramsData: createPdsDto.trainingProgramsData || null,
        otherInfo: createPdsDto.otherInfo || null,
        lastpData: createPdsDto.lastpData || null,
        status: createPdsDto.status || 'draft',
      },
    });

    // Auto-populate profile based on role
    await this.autoPopulateProfile(account.id, account.role, createPdsDto);

    return pds;
  }

  async upsert(createPdsDto: CreatePdsDto) {
    // Check if account exists
    const account = await this.prisma.account.findUnique({
      where: { id: createPdsDto.userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const pds = await this.prisma.pds.upsert({
      where: { userId: createPdsDto.userId },
      update: {
        personalData: createPdsDto.personalData,
        familyData: createPdsDto.familyData,
        educationalData: createPdsDto.educationalData,
        civilServiceData: createPdsDto.civilServiceData || null,
        workExperienceData: createPdsDto.workExperienceData || null,
        voluntaryWorkData: createPdsDto.voluntaryWorkData || null,
        trainingProgramsData: createPdsDto.trainingProgramsData || null,
        otherInfo: createPdsDto.otherInfo || null,
        lastpData: createPdsDto.lastpData || null,
        status: createPdsDto.status || 'draft',
      },
      create: {
        userId: createPdsDto.userId,
        personalData: createPdsDto.personalData,
        familyData: createPdsDto.familyData,
        educationalData: createPdsDto.educationalData,
        civilServiceData: createPdsDto.civilServiceData || null,
        workExperienceData: createPdsDto.workExperienceData || null,
        voluntaryWorkData: createPdsDto.voluntaryWorkData || null,
        trainingProgramsData: createPdsDto.trainingProgramsData || null,
        otherInfo: createPdsDto.otherInfo || null,
        lastpData: createPdsDto.lastpData || null,
        status: createPdsDto.status || 'draft',
      },
    });

    // Auto-populate profile based on role
    await this.autoPopulateProfile(account.id, account.role, createPdsDto);

    return pds;
  }

  /**
   * Auto-populate profile based on account role
   */
  private async autoPopulateProfile(
    accountId: string,
    role: string,
    pdsDto: CreatePdsDto,
  ) {
    try {
      if (role === 'TEACHER') {
        await populateTeacherProfile(this.prisma, accountId, {
          personalData: pdsDto.personalData,
          civilServiceData: pdsDto.civilServiceData,
        });
      } else if (['ADMIN', 'HR', 'EMPLOYEE'].includes(role)) {
        await populateEmployeeProfile(this.prisma, accountId, {
          personalData: pdsDto.personalData,
        });
      }
      // REGULAR role doesn't have a profile
    } catch (error) {
      // Log error but don't fail PDS save
      console.error('Error auto-populating profile:', error);
    }
  }

  async findByUserId(userId: string) {
    const pds = await this.prisma.pds.findUnique({
      where: { userId },
    });

    if (!pds) {
      throw new NotFoundException('PDS not found');
    }

    return pds;
  }

  async findAll() {
    return this.prisma.pds.findMany({
      include: {
        account: {
          select: {
            id: true,
            email: true,
            role: true,
            employeeProfile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            teacherProfile: {
              select: {
                teacherData: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async update(userId: string, updatePdsDto: UpdatePdsDto) {
    const existingPds = await this.prisma.pds.findUnique({
      where: { userId },
    });

    if (!existingPds) {
      throw new NotFoundException('PDS not found');
    }

    return this.prisma.pds.update({
      where: { userId },
      data: {
        ...updatePdsDto,
        updatedAt: new Date(),
      },
    });
  }

  async generatePdf(pdsData: Record<string, any>): Promise<Buffer> {
    return this.pdfService.generateFilledPDF(pdsData);
  }

  async delete(userId: string) {
    const existingPds = await this.prisma.pds.findUnique({
      where: { userId },
    });

    if (!existingPds) {
      throw new NotFoundException('PDS not found');
    }

    return this.prisma.pds.delete({
      where: { userId },
    });
  }
}
