import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Res,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';
import { PdsService } from './pds.service';
import { CreatePdsDto } from './dto/create-pds.dto';
import { UpdatePdsDto } from './dto/update-pds.dto';
import { GeneratePdfDto } from './dto/generate-pdf.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
// User type from JWT strategy (Account with profile info)
type User = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  isActive: boolean;
};

@Controller('pds')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PdsController {
  constructor(private readonly pdsService: PdsService) {}

  @Post()
  @Roles('ADMIN', 'HR_HEAD', 'HR_ASSOCIATE', 'EMPLOYEE', 'SCHOOL_PERSONNEL', 'REGULAR')
  create(@Body() createPdsDto: CreatePdsDto, @CurrentUser() user: User) {
    // Non-admin users can only create PDS for themselves
    if (!['ADMIN', 'HR_HEAD', 'HR_ASSOCIATE'].includes(user.role) && createPdsDto.userId !== user.id) {
      throw new ForbiddenException('You can only create PDS for yourself');
    }
    return this.pdsService.upsert(createPdsDto);
  }

  @Post('upsert')
  @Roles('ADMIN', 'HR_HEAD', 'HR_ASSOCIATE', 'EMPLOYEE', 'SCHOOL_PERSONNEL', 'REGULAR')
  async upsert(@Body() createPdsDto: CreatePdsDto, @CurrentUser() user: User) {
    // Non-admin users can only upsert PDS for themselves
    if (!['ADMIN', 'HR_HEAD', 'HR_ASSOCIATE'].includes(user.role) && createPdsDto.userId !== user.id) {
      throw new ForbiddenException('You can only update PDS for yourself');
    }
    try {
      // console.log('Received PDS upsert request:', JSON.stringify(createPdsDto, null, 2));
      const result = await this.pdsService.upsert(createPdsDto);
      // console.log('PDS upsert successful:', result);
      return result;
    } catch (error) {
      console.error('Error in PDS upsert:', error);
      throw error;
    }
  }

  @Get()
  @Roles('ADMIN', 'HR_HEAD', 'HR_ASSOCIATE')
  findAll() {
    return this.pdsService.findAll();
  }

  @Get(':userId')
  @Roles('ADMIN', 'HR_HEAD', 'HR_ASSOCIATE', 'EMPLOYEE', 'SCHOOL_PERSONNEL', 'REGULAR')
  findOne(@Param('userId') userId: string, @CurrentUser() user: User) {
    // Non-admin users can only view their own PDS
    if (!['ADMIN', 'HR_HEAD', 'HR_ASSOCIATE'].includes(user.role) && userId !== user.id) {
      throw new ForbiddenException('You can only view your own PDS');
    }
    return this.pdsService.findByUserId(userId);
  }

  @Put(':userId')
  @Roles('ADMIN', 'HR_HEAD', 'HR_ASSOCIATE', 'EMPLOYEE', 'SCHOOL_PERSONNEL', 'REGULAR')
  update(
    @Param('userId') userId: string,
    @Body() updatePdsDto: UpdatePdsDto,
    @CurrentUser() user: User,
  ) {
    // Non-admin users can only update their own PDS
    if (!['ADMIN', 'HR_HEAD', 'HR_ASSOCIATE'].includes(user.role) && userId !== user.id) {
      throw new ForbiddenException('You can only update your own PDS');
    }
    return this.pdsService.update(userId, updatePdsDto);
  }

  @Delete(':userId')
  @Roles('ADMIN', 'HR_HEAD', 'HR_ASSOCIATE')
  remove(@Param('userId') userId: string) {
    return this.pdsService.delete(userId);
  }

  @Post('generate-pdf')
  @Roles('ADMIN', 'HR_HEAD', 'HR_ASSOCIATE', 'EMPLOYEE', 'SCHOOL_PERSONNEL', 'REGULAR')
  async generatePdf(
    @Body() generatePdfDto: GeneratePdfDto,
    @Res() res: Response,
    @CurrentUser() user: User,
  ) {
    // Non-admin users can only generate PDF for their own PDS
    if (!['ADMIN', 'HR_HEAD', 'HR_ASSOCIATE'].includes(user.role) && generatePdfDto.pdsData?.userId !== user.id) {
      throw new ForbiddenException('You can only generate PDF for your own PDS');
    }
    try {
      console.log(
        'PDF generation request received',
        JSON.stringify(generatePdfDto.pdsData, null, 2),
      );
      const pdfBuffer = await this.pdsService.generatePdf(generatePdfDto.pdsData);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=Personal_Data_Sheet.pdf');
      res.send(pdfBuffer);
    } catch (error: any) {
      console.error('PDF generation error in controller:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      res.status(500).json({
        message: 'Failed to generate PDF',
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  }
}
