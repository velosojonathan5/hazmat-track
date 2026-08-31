import { ApiProperty } from '@nestjs/swagger';
import { ChecklistCategory } from '../../../domain/entities/checklist-item-definition.entity.js';

export class ChecklistItemResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: ChecklistCategory })
  category!: ChecklistCategory;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  description!: string;
}
