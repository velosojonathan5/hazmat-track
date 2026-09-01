import type { Inspection, NewInspectionInput } from '../../domain/inspection/inspection';
import type { InspectionRepository } from '../../domain/inspection/inspection-repository.port';

export class RegisterInspectionUseCase {
  private readonly inspectionRepository: InspectionRepository;

  constructor(inspectionRepository: InspectionRepository) {
    this.inspectionRepository = inspectionRepository;
  }

  execute(input: NewInspectionInput): Promise<Inspection> {
    return this.inspectionRepository.register(input);
  }
}
