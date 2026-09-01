import type { AnswerValue } from '../entities/checklist-answer.entity.js';
import type { Checklist, ChecklistStatus } from '../entities/checklist.entity.js';

export const CHECKLIST_REPOSITORY_PORT = Symbol('CHECKLIST_REPOSITORY_PORT');

export interface NewChecklistAnswer {
  itemDefinitionId: string;
  answer: AnswerValue;
  note?: string;
  photoUrl?: string;
}

export interface NewChecklist {
  vehicleId: string;
  vehiclePlate: string;
  driverId: string;
  driverName: string;
  driverCnh: string;
  unNumber: string;
  inspectorId: string;
  inspectorName: string;
  status: ChecklistStatus;
  answers: NewChecklistAnswer[];
}

export interface ChecklistFilters {
  vehiclePlate?: string;
  driverId?: string;
  unNumber?: string;
  from?: Date;
  to?: Date;
}

export interface ChecklistRepository {
  create(input: NewChecklist): Promise<Checklist>;
  findById(id: string): Promise<Checklist | null>;
  findMany(filters: ChecklistFilters): Promise<Checklist[]>;
}
