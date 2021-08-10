import { ApiProperty } from '@nestjs/swagger';
import { IsHash, Length } from 'class-validator';

export class CreateSubtitleFileDto {
  @ApiProperty({ minLength: 4, maxLength: 1024 })
  @Length(4, 1024)
  filename: string;

  @ApiProperty({ minLength: 40, maxLength: 40 })
  @IsHash('sha1')
  sha1: string;

  remark?: string;

  series: number;

  episode?: number;
}
