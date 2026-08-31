export interface HealthStatus {
  status: 'ok' | 'degraded';
  database: boolean;
  timestamp: string;
}
