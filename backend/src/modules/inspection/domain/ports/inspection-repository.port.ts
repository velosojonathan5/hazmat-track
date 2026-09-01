import type { InspectionEvidenceType } from '../entities/inspection-evidence.entity.js';
import type { Inspection, RingelmannGrade } from '../entities/inspection.entity.js';

export const INSPECTION_REPOSITORY_PORT = Symbol('INSPECTION_REPOSITORY_PORT');

export interface NewInspectionEvidence {
  type: InspectionEvidenceType;
  url: string;
  storageKey: string;
}

export interface NewInspection {
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

export interface InspectionFilters {
  vehiclePlate?: string;
  unNumber?: string;
  from?: Date;
  to?: Date;
}

export interface InspectionRepository {
  create(input: NewInspection): Promise<Inspection>;
  findById(id: string): Promise<Inspection | null>;
  findMany(filters: InspectionFilters): Promise<Inspection[]>;
}
