import { Module } from '@nestjs/common';
import { Files201Controller } from './files201.controller';
import { Files201Service } from './files201.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [Files201Controller],
  providers: [Files201Service],
  exports: [Files201Service],
})
export class Files201Module {}
