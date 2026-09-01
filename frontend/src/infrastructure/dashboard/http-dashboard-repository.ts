import type { DashboardFilters, DashboardMetrics } from '../../domain/dashboard/dashboard-metrics';
import type { DashboardRepository } from '../../domain/dashboard/dashboard-repository.port';
import { apiGet } from '../http/api-client';

function buildQuery(filters: DashboardFilters): string {
  const params = new URLSearchParams();
  if (filters.vehiclePlate) params.set('vehiclePlate', filters.vehiclePlate);
  if (filters.unNumber) params.set('unNumber', filters.unNumber);
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  const query = params.toString();
  return query ? `?${query}` : '';
}

export class HttpDashboardRepository implements DashboardRepository {
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  getMetrics(filters: DashboardFilters): Promise<DashboardMetrics> {
    return apiGet<DashboardMetrics>(`/dashboard/metrics${buildQuery(filters)}`, { token: this.token });
  }
}
