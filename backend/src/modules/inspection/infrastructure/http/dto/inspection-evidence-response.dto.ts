import { ApiProperty } from '@nestjs/swagger';
import { InspectionEvidenceType } from '../../../domain/entities/inspection-evidence.entity.js';

export class InspectionEvidenceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: InspectionEvidenceType })
  type!: InspectionEvidenceType;

  @ApiProperty()
  url!: string;
}
