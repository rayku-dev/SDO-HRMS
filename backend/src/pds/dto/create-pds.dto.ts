import { IsString, IsObject, IsOptional, IsNotEmpty } from 'class-validator';

export class CreatePdsDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsObject()
  @IsNotEmpty()
  personalData: Record<string, any>;

  @IsObject()
  @IsNotEmpty()
  familyData: Record<string, any>;

  @IsObject()
  @IsNotEmpty()
  educationalData: Record<string, any>;

  @IsObject()
  @IsOptional()
  civilServiceData?: Record<string, any>;

  @IsObject()
  @IsOptional()
  workExperienceData?: Record<string, any>;

  @IsObject()
  @IsOptional()
  voluntaryWorkData?: Record<string, any>;

  @IsObject()
  @IsOptional()
  trainingProgramsData?: Record<string, any>;

  @IsObject()
  @IsOptional()
  otherInfo?: Record<string, any>;

  @IsObject()
  @IsOptional()
  lastpData?: Record<string, any>;

  @IsString()
  @IsOptional()
  status?: string;
}
