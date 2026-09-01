import { Inject, Injectable } from '@nestjs/common';
import type { Inspection } from '../../domain/entities/inspection.entity.js';
import type { RingelmannGrade } from '../../domain/entities/inspection.entity.js';
import {
  INSPECTION_REPOSITORY_PORT,
  type InspectionRepository,
  type NewInspectionEvidence,
} from '../../domain/ports/inspection-repository.port.js';

export interface RegisterInspectionInput {
  vehiclePlate: string;
  unNumber: string;
  inspectorId: string;
  inspectorName: string;
  latitude: number;
  longitude: number;
  ringelmannGrade?: RingelmannGrade;
  comments?: string;
  evidences: NewInspectionEvidence[];
}

@Injectable()
export class RegisterInspectionUseCase {
  constructor(
    @Inject(INSPECTION_REPOSITORY_PORT) private readonly inspectionRepository: InspectionRepository,
  ) {}

  execute(input: RegisterInspectionInput): Promise<Inspection> {
    return this.inspectionRepository.create(input);
  }
}
