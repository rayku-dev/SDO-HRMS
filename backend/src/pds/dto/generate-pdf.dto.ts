import { IsObject, IsNotEmpty } from 'class-validator';

export class GeneratePdfDto {
  @IsObject()
  @IsNotEmpty()
  pdsData: Record<string, any>;
}
