import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
  @ApiProperty({
    description: 'JWT token, please add to http bearer auth header',
  })
  token: string;

  payload: { id: number; name: string; email: string };
}
