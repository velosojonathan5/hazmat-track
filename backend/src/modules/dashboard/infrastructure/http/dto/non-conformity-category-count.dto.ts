import { ApiProperty } from '@nestjs/swagger';
import { ChecklistCategory } from '../../../../checklist/domain/entities/checklist-item-definition.entity.js';

export class NonConformityCategoryCountDto {
  @ApiProperty({ enum: ChecklistCategory })
  category!: ChecklistCategory;

  @ApiProperty()
  count!: number;
}
