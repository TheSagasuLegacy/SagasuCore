import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AppRoles } from 'src/app.roles';

export class AddRolesDto {
  user_id: number;

  @ApiProperty({ type: 'enum', enum: AppRoles, required: true, isArray: true })
  @IsEnum(AppRoles, { each: true })
  roles: (keyof typeof AppRoles)[];
}
