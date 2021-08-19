import { ApiProperty } from '@nestjs/swagger';
import {
  IsHash,
  Length,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import * as isFilename from 'valid-filename';

export function IsFilename(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLongerThan',
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

export class CreateSubtitleFileDto {
  @ApiProperty({ minLength: 4, maxLength: 1024 })
  @IsFilename()
  @Length(4, 1024)
  filename: string;

  @ApiProperty({ minLength: 40, maxLength: 40 })
  @IsHash('sha1')
  sha1: string;

  remark?: string;

  series: number;

  episode?: number;
}
