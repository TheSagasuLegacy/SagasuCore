import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { AddRolesDto } from './add-roles.dto';

export class DeleteRolesDto extends AddRolesDto {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @ApiProperty({ required: false, default: false })
  @IsOptional()
  ignore_nonexistence: boolean = false;
}
