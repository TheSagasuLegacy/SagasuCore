import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { DeepPartial } from 'typeorm';
import { Dialogs } from '../entities/dialog.entity';

export class CreateDialogDto implements DeepPartial<Dialogs> {
  content: string;

  begin: number;

  end: number;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  file_id: string;

  user_id: number;
}
