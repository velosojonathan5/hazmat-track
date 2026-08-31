import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../domain/entities/user.entity.js';

export class AuthenticatedUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;
}
