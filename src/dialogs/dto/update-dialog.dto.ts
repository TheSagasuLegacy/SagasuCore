import { PartialType } from '@nestjs/swagger';
import { CreateDialogDto } from './create-dialog.dto';

export class UpdateDialogDto extends PartialType(CreateDialogDto) {}
