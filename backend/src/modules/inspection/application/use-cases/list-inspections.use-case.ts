import { Inject, Injectable } from '@nestjs/common';
import type { Inspection } from '../../domain/entities/inspection.entity.js';
import {
  INSPECTION_REPOSITORY_PORT,
  type InspectionFilters,
  type InspectionRepository,
} from '../../domain/ports/inspection-repository.port.js';

@Injectable()
export class ListInspectionsUseCase {
  constructor(
    @Inject(INSPECTION_REPOSITORY_PORT) private readonly inspectionRepository: InspectionRepository,
  ) {}

  execute(filters: InspectionFilters): Promise<Inspection[]> {
    return this.inspectionRepository.findMany(filters);
  }
}
