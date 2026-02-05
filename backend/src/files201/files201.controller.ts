import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Files201Service } from './files201.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs/promises';
import { diskStorage } from 'multer';

type User = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  isActive: boolean;
};

// Configure multer storage
const storage = diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'files201');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `file-${uniqueSuffix}${ext}`);
  },
});

@Controller('files201')
@UseGuards(JwtAuthGuard, RolesGuard)
export class Files201Controller {
  constructor(private readonly files201Service: Files201Service) {}

  @Post('upload')
  @Roles('ADMIN', 'HR', 'EMPLOYEE', 'TEACHER', 'REGULAR')
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
      },
    }),
  )
  async uploadFile(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body('category') category?: string,
    @Body('description') description?: string,
    @Body('accountId') accountId?: string,
  ) {
    if (!file) {
      throw new ForbiddenException('No file uploaded');
    }

    // Non-admin users can only upload for themselves
    const targetAccountId = accountId || user.id;
    if (!['ADMIN', 'HR'].includes(user.role) && targetAccountId !== user.id) {
      throw new ForbiddenException('You can only upload files for yourself');
    }

    return this.files201Service.create(
      targetAccountId,
      {
        fileName: file.originalname,
        filePath: file.filename,
        fileSize: file.size,
        mimeType: file.mimetype,
        category: category || null,
        description: description || null,
      },
      user.id,
    );
  }

  @Get()
  @Roles('ADMIN', 'HR')
  findAll() {
    return this.files201Service.findAll();
  }

  @Get('my-files')
  @Roles('ADMIN', 'HR', 'EMPLOYEE', 'TEACHER', 'REGULAR')
  findMyFiles(@CurrentUser() user: User) {
    return this.files201Service.findByAccountId(user.id);
  }

  @Get('account/:accountId')
  @Roles('ADMIN', 'HR')
  findByAccount(@Param('accountId') accountId: string) {
    return this.files201Service.findByAccountId(accountId);
  }

  @Get('stats')
  @Roles('ADMIN', 'HR', 'EMPLOYEE', 'TEACHER', 'REGULAR')
  getStats(@CurrentUser() user: User) {
    const accountId = ['ADMIN', 'HR'].includes(user.role) ? undefined : user.id;
    return this.files201Service.getFileStats(accountId);
  }

  @Get(':id')
  @Roles('ADMIN', 'HR', 'EMPLOYEE', 'TEACHER', 'REGULAR')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.files201Service.findOne(id);
  }

  @Delete(':id')
  @Roles('ADMIN', 'HR', 'EMPLOYEE', 'TEACHER', 'REGULAR')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.files201Service.delete(id, user.id, user.role);
  }
}
