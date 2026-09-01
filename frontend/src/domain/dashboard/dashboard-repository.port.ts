import type { DashboardFilters, DashboardMetrics } from './dashboard-metrics';

export interface DashboardRepository {
  getMetrics(filters: DashboardFilters): Promise<DashboardMetrics>;
}
