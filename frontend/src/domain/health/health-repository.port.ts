import type { HealthStatus } from './health-status';

export interface HealthRepository {
  getStatus(): Promise<HealthStatus>;
}
