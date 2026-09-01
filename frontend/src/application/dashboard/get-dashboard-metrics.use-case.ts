import type { DashboardFilters, DashboardMetrics } from '../../domain/dashboard/dashboard-metrics';
import type { DashboardRepository } from '../../domain/dashboard/dashboard-repository.port';

export class GetDashboardMetricsUseCase {
  private readonly dashboardRepository: DashboardRepository;

  constructor(dashboardRepository: DashboardRepository) {
    this.dashboardRepository = dashboardRepository;
  }

  execute(filters: DashboardFilters): Promise<DashboardMetrics> {
    return this.dashboardRepository.getMetrics(filters);
  }
}
