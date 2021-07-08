import { PartialType } from '@nestjs/swagger';
import { CreateSubtitleFileDto } from './create-file.dto';

export class UpdateSubtitleFile extends PartialType(CreateSubtitleFileDto) {}
