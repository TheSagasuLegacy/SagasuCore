import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateDialogDto {
  content: string;

  begin: number;

  end: number;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  file: string;
}
