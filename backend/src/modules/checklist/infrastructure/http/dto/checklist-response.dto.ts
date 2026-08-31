import { ApiProperty } from '@nestjs/swagger';
import { ChecklistStatus } from '../../../domain/entities/checklist.entity.js';
import { ChecklistAnswerResponseDto } from './checklist-answer-response.dto.js';

export class ChecklistResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  vehicleId!: string;

  @ApiProperty()
  driverId!: string;

  @ApiProperty()
  unNumber!: string;

  @ApiProperty()
  inspectorId!: string;

  @ApiProperty()
  inspectorName!: string;

  @ApiProperty({ enum: ChecklistStatus })
  status!: ChecklistStatus;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({ type: [ChecklistAnswerResponseDto] })
  answers!: ChecklistAnswerResponseDto[];
}
