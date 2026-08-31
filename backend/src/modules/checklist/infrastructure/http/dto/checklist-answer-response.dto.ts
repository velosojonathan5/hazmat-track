import { ApiProperty } from '@nestjs/swagger';
import { AnswerValue } from '../../../domain/entities/checklist-answer.entity.js';

export class ChecklistAnswerResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  itemDefinitionId!: string;

  @ApiProperty({ enum: AnswerValue })
  answer!: AnswerValue;

  @ApiProperty({ required: false })
  note?: string;

  @ApiProperty({ required: false })
  photoUrl?: string;
}
