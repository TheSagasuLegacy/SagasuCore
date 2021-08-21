import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, IsUUID } from 'class-validator';
import { DeepPartial } from 'typeorm';
import { Dialogs } from '../entities/dialog.entity';

export class CreateDialogDto implements DeepPartial<Dialogs> {
  content: string;

  begin: number;

  end: number;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  file_id: string;

  @ApiProperty({ required: true })
  @IsPositive()
  user_id: number;
}
