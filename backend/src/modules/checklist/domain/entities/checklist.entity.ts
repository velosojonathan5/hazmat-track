import type { ChecklistAnswer } from './checklist-answer.entity.js';

export enum ChecklistStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
}

export interface Checklist {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  driverId: string;
  driverName: string;
  driverCnh: string;
  unNumber: string;
  inspectorId: string;
  inspectorName: string;
  status: ChecklistStatus;
  createdAt: Date;
  answers: ChecklistAnswer[];
}
