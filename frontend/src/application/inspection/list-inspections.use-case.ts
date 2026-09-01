import type { Inspection, InspectionListFilters } from '../../domain/inspection/inspection';
import type { InspectionRepository } from '../../domain/inspection/inspection-repository.port';

export class ListInspectionsUseCase {
  private readonly inspectionRepository: InspectionRepository;

  constructor(inspectionRepository: InspectionRepository) {
    this.inspectionRepository = inspectionRepository;
  }

  execute(filters: InspectionListFilters): Promise<Inspection[]> {
    return this.inspectionRepository.list(filters);
  }
}
