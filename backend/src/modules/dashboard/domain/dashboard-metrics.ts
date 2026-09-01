import type { ChecklistCategory } from '../../checklist/domain/entities/checklist-item-definition.entity.js';
import type { NonConformity } from '../../checklist/domain/entities/non-conformity.entity.js';

export interface NonConformityCategoryCount {
  category: ChecklistCategory;
  count: number;
}

export interface DashboardMetrics {
  totalChecklists: number;
  complianceRate: number;
  openNonConformities: number;
  totalInspections: number;
  nonConformitiesByCategory: NonConformityCategoryCount[];
  pendingNonConformities: NonConformity[];
}

export interface DashboardFilters {
  vehiclePlate?: string;
  unNumber?: string;
  from?: Date;
  to?: Date;
}
