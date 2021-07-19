import { IsUUID } from 'class-validator';

export class CreateDialogDto {
  content: string;

  begin: number;

  end: number;

  @IsUUID()
  file: string;
}
