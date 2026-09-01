import type { ChecklistCategory } from '../checklist/checklist-item';

export interface NonConformityCategoryCount {
  category: ChecklistCategory;
  count: number;
}

export interface PendingNonConformity {
  id: string;
  sourceId: string;
  category: ChecklistCategory;
  description: string;
  status: 'open' | 'resolved';
  createdAt: string;
}

export interface DashboardMetrics {
  totalChecklists: number;
  complianceRate: number;
  openNonConformities: number;
  totalInspections: number;
  nonConformitiesByCategory: NonConformityCategoryCount[];
  pendingNonConformities: PendingNonConformity[];
}

export interface DashboardFilters {
  vehiclePlate?: string;
  unNumber?: string;
  from?: string;
  to?: string;
}
