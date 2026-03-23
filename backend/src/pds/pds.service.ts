import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePdsDto } from './dto/create-pds.dto';
import { UpdatePdsDto } from './dto/update-pds.dto';
import { PDFService } from './pdf.service';
import { populateUserProfile } from '@/lib/helpers/pds-extractors';

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
   * Auto-populate profile based on PDS data
   */
  private async autoPopulateProfile(accountId: string, role: string, pdsData: any) {
    try {
      // All roles except maybe REGULAR now use the unified User table
      // We'll populate it for everyone who has a profile
      await populateUserProfile(this.prisma, accountId, {
        personalData: pdsData.personalData,
        familyData: pdsData.familyData,
        civilServiceData: pdsData.civilServiceData,
      });
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
    const pdsList = await this.prisma.pds.findMany({
      include: {
        account: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return pdsList.map((pds) => {
      const account = pds.account;

      // Try to get names from user profile first
      let firstName = account.user?.firstName;
      let lastName = account.user?.lastName;

      // Fallback to names in PDS personalData if profile names are missing
      if (!firstName && !lastName) {
        const personalData = pds.personalData as any;
        firstName = personalData?.firstName || personalData?.personalData?.firstName;
        lastName =
          personalData?.lastName ||
          personalData?.personalData?.lastName ||
          personalData?.surname ||
          personalData?.personalData?.surname;
      }

      return {
        ...pds,
        user: {
          id: account.id,
          email: account.email,
          firstName: firstName || null,
          lastName: lastName || null,
          role: account.role,
        },
      };
    });
  }

  async update(userId: string, updatePdsDto: UpdatePdsDto) {
    const existingPds = await this.prisma.pds.findUnique({
      where: { userId },
    });

    if (!existingPds) {
      throw new NotFoundException('PDS not found');
    }

    const updatedPds = await this.prisma.pds.update({
      where: { userId },
      data: {
        ...updatePdsDto,
        updatedAt: new Date(),
      },
    });

    // Auto-populate profile after update
    await this.autoPopulateProfile(userId, '', updatedPds);

    return updatedPds;
  }

  async generatePdf(pdsData: Record<string, any>): Promise<Buffer> {
    // If we have userId in the data, also update the profile
    if (pdsData.userId) {
      await this.autoPopulateProfile(pdsData.userId, '', pdsData);
    }
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
