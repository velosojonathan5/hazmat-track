import { ApiProperty } from '@nestjs/swagger';
import { NonConformityResponseDto } from '../../../../checklist/infrastructure/http/dto/non-conformity-response.dto.js';
import { NonConformityCategoryCountDto } from './non-conformity-category-count.dto.js';

export class DashboardMetricsResponseDto {
  @ApiProperty()
  totalChecklists!: number;

  @ApiProperty({ description: 'Percentage (0-100) of checklists with status "compliant"' })
  complianceRate!: number;

  @ApiProperty()
  openNonConformities!: number;

  @ApiProperty()
  totalInspections!: number;

  @ApiProperty({ type: [NonConformityCategoryCountDto] })
  nonConformitiesByCategory!: NonConformityCategoryCountDto[];

  @ApiProperty({ type: [NonConformityResponseDto] })
  pendingNonConformities!: NonConformityResponseDto[];
}
