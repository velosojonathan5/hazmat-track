import { ApiProperty } from '@nestjs/swagger';
import {
  NonConformitySourceType,
  NonConformityStatus,
} from '../../../domain/entities/non-conformity.entity.js';

export class NonConformityResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: NonConformitySourceType })
  sourceType!: NonConformitySourceType;

  @ApiProperty()
  sourceId!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ enum: NonConformityStatus })
  status!: NonConformityStatus;

  @ApiProperty()
  createdAt!: Date;
}
