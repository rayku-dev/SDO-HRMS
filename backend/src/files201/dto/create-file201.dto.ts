import { IsString, IsOptional, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';

export class CreateFile201Dto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  filePath: string;

  @IsNumber()
  @IsNotEmpty()
  fileSize: number;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
