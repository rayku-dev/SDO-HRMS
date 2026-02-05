import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateFile201Dto } from './dto/create-file201.dto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class Files201Service {
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'files201');

  constructor(private prisma: PrismaService) {
    // Ensure upload directory exists
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error('Error creating upload directory:', error);
    }
  }

  async create(accountId: string, createFileDto: CreateFile201Dto, uploadedBy?: string) {
    return this.prisma.file201.create({
      data: {
        accountId,
        fileName: createFileDto.fileName,
        filePath: createFileDto.filePath,
        fileSize: createFileDto.fileSize,
        mimeType: createFileDto.mimeType,
        category: createFileDto.category || null,
        description: createFileDto.description || null,
        uploadedBy: uploadedBy || accountId,
      },
    });
  }

  async findAll(accountId?: string) {
    const where = accountId ? { accountId } : {};
    return this.prisma.file201.findMany({
      where,
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
        },
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });
  }

  async findByAccountId(accountId: string) {
    return this.prisma.file201.findMany({
      where: { accountId },
      orderBy: {
        uploadedAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const file = await this.prisma.file201.findUnique({
      where: { id },
      include: {
        account: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async delete(id: string, accountId: string, userRole: string) {
    const file = await this.prisma.file201.findUnique({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Only admin/HR or file owner can delete
    if (!['ADMIN', 'HR'].includes(userRole) && file.accountId !== accountId) {
      throw new ForbiddenException('You can only delete your own files');
    }

    // Delete physical file
    try {
      const filePath = path.join(this.uploadDir, file.filePath);
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting physical file:', error);
    }

    return this.prisma.file201.delete({
      where: { id },
    });
  }

  async getFileStats(accountId?: string) {
    const where = accountId ? { accountId } : {};
    const files = await this.prisma.file201.findMany({ where });

    const totalSize = files.reduce((sum, file) => sum + file.fileSize, 0);
    const categories = files.reduce((acc, file) => {
      const cat = file.category || 'uncategorized';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalFiles: files.length,
      totalSize,
      categories,
    };
  }
}
