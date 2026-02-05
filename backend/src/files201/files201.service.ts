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
    // If strict mode is requested we might want to validate categoryId, but DB constraints handle ref integrity
    return this.prisma.file201.create({
      data: {
        accountId,
        fileName: createFileDto.fileName,
        filePath: createFileDto.filePath,
        fileSize: createFileDto.fileSize,
        mimeType: createFileDto.mimeType,
        category: createFileDto.category || null,
        categoryId: createFileDto.categoryId || null,
        description: createFileDto.description || null,
        uploadedBy: uploadedBy || accountId,
      },
    });
  }

  // --- Category Management ---

  async getCategories() {
    return this.prisma.fileCategory.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async createCategory(data: { name: string; description?: string }) {
    return this.prisma.fileCategory.create({
      data,
    });
  }

  async deleteCategory(id: string) {
    return this.prisma.fileCategory.delete({
      where: { id },
    });
  }

  // --------------------------

  async findAll(accountId?: string) {
    const where = accountId ? { accountId } : {};
    return this.prisma.file201.findMany({
      where,
      include: {
        fileCategory: true,
        account: {
          select: {
            id: true,
            email: true,
            role: true,
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
      include: {
        fileCategory: true,
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const file = await this.prisma.file201.findUnique({
      where: { id },
      include: {
        fileCategory: true,
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
    if (!['ADMIN', 'HR_ASSOCIATE', 'HR_HEAD'].includes(userRole) && file.accountId !== accountId) {
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
    const files = await this.prisma.file201.findMany({
      where,
      include: { fileCategory: true },
    });

    const totalSize = files.reduce((sum, file) => sum + file.fileSize, 0);
    const categories = files.reduce((acc, file) => {
      // Use category name from relation or legacy field or Uncategorized
      const cat = file.fileCategory?.name || file.category || 'Uncategorized';
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

