import { PartialType } from '@nestjs/swagger';
import { CreateSubtitleFileDto } from './create-file.dto';

export class UpdateSubtitleFileDto extends PartialType(CreateSubtitleFileDto) {}
