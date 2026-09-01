import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InspectionEvidenceResponseDto } from './inspection-evidence-response.dto.js';

export class InspectionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  vehiclePlate!: string;

  @ApiProperty()
  unNumber!: string;

  @ApiProperty()
  inspectorId!: string;

  @ApiProperty()
  inspectorName!: string;

  @ApiProperty()
  latitude!: number;

  @ApiProperty()
  longitude!: number;

  @ApiPropertyOptional({ enum: [0, 1, 2, 3, 4, 5] })
  ringelmannGrade?: number;

  @ApiPropertyOptional()
  comments?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({ type: [InspectionEvidenceResponseDto] })
  evidences!: InspectionEvidenceResponseDto[];
}
