import { Module } from '@nestjs/common';
import { PdsService } from './pds.service';
import { PdsController } from './pds.controller';
import { PDFService } from './pdf.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PdsController],
  providers: [PdsService, PDFService],
  exports: [PdsService],
})
export class PdsModule {}
