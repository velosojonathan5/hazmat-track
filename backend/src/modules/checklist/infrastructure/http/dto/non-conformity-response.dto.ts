import { ApiProperty } from '@nestjs/swagger';
import { ChecklistCategory } from '../../../domain/entities/checklist-item-definition.entity.js';
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

  @ApiProperty({ enum: ChecklistCategory })
  category!: ChecklistCategory;

  @ApiProperty()
  description!: string;

  @ApiProperty({ enum: NonConformityStatus })
  status!: NonConformityStatus;

  @ApiProperty()
  createdAt!: Date;
}
