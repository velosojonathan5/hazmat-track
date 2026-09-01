import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Inspection } from '../../domain/entities/inspection.entity.js';
import {
  INSPECTION_REPOSITORY_PORT,
  type InspectionRepository,
} from '../../domain/ports/inspection-repository.port.js';

@Injectable()
export class GetInspectionUseCase {
  constructor(
    @Inject(INSPECTION_REPOSITORY_PORT) private readonly inspectionRepository: InspectionRepository,
  ) {}

  async execute(id: string): Promise<Inspection> {
    const inspection = await this.inspectionRepository.findById(id);
    if (!inspection) {
      throw new NotFoundException('Inspection not found');
    }

    return inspection;
  }
}
