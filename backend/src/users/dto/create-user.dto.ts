import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsOptional()
  nameExtension?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  designation?: string;

  @IsDateString()
  @IsOptional()
  appointmentDate?: string;

  @IsString()
  @IsOptional()
  schedule?: string;

  @IsString()
  @IsOptional()
  appointment?: string;

  @IsString()
  @IsOptional()
  jobTitle?: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsString()
  @IsOptional()
  supervisor?: string;

  @IsString()
  @IsOptional()
  hrHead?: string;

  @IsString()
  @IsOptional()
  approver?: string;

  @IsString()
  @IsOptional()
  employeeNumber?: string;
}
