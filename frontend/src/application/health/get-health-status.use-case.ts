import type { HealthRepository } from '../../domain/health/health-repository.port';
import type { HealthStatus } from '../../domain/health/health-status';

export class GetHealthStatusUseCase {
  private readonly healthRepository: HealthRepository;

  constructor(healthRepository: HealthRepository) {
    this.healthRepository = healthRepository;
  }

  execute(): Promise<HealthStatus> {
    return this.healthRepository.getStatus();
  }
}
