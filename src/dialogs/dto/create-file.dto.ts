import { ApiProperty } from '@nestjs/swagger';
import {
  IsHash,
  Length,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { DeepPartial } from 'typeorm';
import * as isFilename from 'valid-filename';
import { SubtitleFile } from '../entities/files.entity';

export function IsFilename(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFilename',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && isFilename(value);
        },
      },
    });
  };
}

export class CreateSubtitleFileDto implements DeepPartial<SubtitleFile> {
  @ApiProperty({ minLength: 4, maxLength: 1024 })
  @IsFilename()
  @Length(4, 1024)
  filename: string;

  @ApiProperty({ minLength: 40, maxLength: 40 })
  @IsHash('sha1')
  sha1: string;

  remark?: string;

  series_id: number;

  episode_id?: number;

  user_id: number;
}
