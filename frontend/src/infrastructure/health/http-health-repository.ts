import type { HealthRepository } from '../../domain/health/health-repository.port';
import type { HealthStatus } from '../../domain/health/health-status';
import { apiGet } from '../http/api-client';

export class HttpHealthRepository implements HealthRepository {
  getStatus(): Promise<HealthStatus> {
    return apiGet<HealthStatus>('/health');
  }
}
