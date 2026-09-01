import { Inject, Injectable } from '@nestjs/common';
import { ChecklistStatus } from '../../../checklist/domain/entities/checklist.entity.js';
import type { ChecklistCategory } from '../../../checklist/domain/entities/checklist-item-definition.entity.js';
import { NonConformityStatus } from '../../../checklist/domain/entities/non-conformity.entity.js';
import {
  CHECKLIST_REPOSITORY_PORT,
  type ChecklistRepository,
} from '../../../checklist/domain/ports/checklist-repository.port.js';
import {
  NON_CONFORMITY_REPOSITORY_PORT,
  type NonConformityRepository,
} from '../../../checklist/domain/ports/non-conformity-repository.port.js';
import {
  INSPECTION_REPOSITORY_PORT,
  type InspectionRepository,
} from '../../../inspection/domain/ports/inspection-repository.port.js';
import type { DashboardFilters, DashboardMetrics } from '../../domain/dashboard-metrics.js';

@Injectable()
export class GetDashboardMetricsUseCase {
  constructor(
    @Inject(CHECKLIST_REPOSITORY_PORT) private readonly checklistRepository: ChecklistRepository,
    @Inject(INSPECTION_REPOSITORY_PORT) private readonly inspectionRepository: InspectionRepository,
    @Inject(NON_CONFORMITY_REPOSITORY_PORT)
    private readonly nonConformityRepository: NonConformityRepository,
  ) {}

  async execute(filters: DashboardFilters): Promise<DashboardMetrics> {
    const [checklists, inspections, openNonConformities] = await Promise.all([
      this.checklistRepository.findMany({
        vehiclePlate: filters.vehiclePlate,
        unNumber: filters.unNumber,
        from: filters.from,
        to: filters.to,
      }),
      this.inspectionRepository.findMany({
        vehiclePlate: filters.vehiclePlate,
        unNumber: filters.unNumber,
        from: filters.from,
        to: filters.to,
      }),
      this.nonConformityRepository.findMany({
        status: NonConformityStatus.OPEN,
        from: filters.from,
        to: filters.to,
      }),
    ]);

    const isVehicleOrCargoFiltered = Boolean(filters.vehiclePlate || filters.unNumber);
    const checklistIds = new Set(checklists.map((checklist) => checklist.id));
    const scopedOpenNonConformities = isVehicleOrCargoFiltered
      ? openNonConformities.filter((nonConformity) => checklistIds.has(nonConformity.sourceId))
      : openNonConformities;

    const compliantCount = checklists.filter(
      (checklist) => checklist.status === ChecklistStatus.COMPLIANT,
    ).length;

    const categoryCounts = new Map<ChecklistCategory, number>();
    for (const nonConformity of scopedOpenNonConformities) {
      categoryCounts.set(nonConformity.category, (categoryCounts.get(nonConformity.category) ?? 0) + 1);
    }

    return {
      totalChecklists: checklists.length,
      complianceRate: checklists.length === 0 ? 0 : Math.round((compliantCount / checklists.length) * 100),
      openNonConformities: scopedOpenNonConformities.length,
      totalInspections: inspections.length,
      nonConformitiesByCategory: Array.from(categoryCounts.entries()).map(([category, count]) => ({
        category,
        count,
      })),
      pendingNonConformities: scopedOpenNonConformities,
    };
  }
}
