import { Length } from 'class-validator';

export class CreateSubtitleFileDto {
  @Length(4, 1024)
  filename: string;

  @Length(40)
  sha1: string;

  remark?: string;

  series: number;

  episode?: number;
}
