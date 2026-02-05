import { PartialType } from '@nestjs/swagger';
import { CreatePdsDto } from './create-pds.dto';

export class UpdatePdsDto extends PartialType(CreatePdsDto) {}
