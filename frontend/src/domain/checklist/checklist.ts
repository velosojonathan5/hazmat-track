export type AnswerValue = 'yes' | 'no' | 'not_applicable';

export const ANSWER_LABEL: Record<AnswerValue, string> = {
  yes: 'SIM',
  no: 'NÃO',
  not_applicable: 'N.A.',
};

export interface ChecklistAnswer {
  id: string;
  itemDefinitionId: string;
  answer: AnswerValue;
  note?: string;
  photoUrl?: string;
}

export type ChecklistStatus = 'compliant' | 'non_compliant';

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
  createdAt: string;
  answers: ChecklistAnswer[];
}

export interface NewChecklistAnswer {
  itemDefinitionId: string;
  answer: AnswerValue;
  note?: string;
  photoUrl?: string;
}

export interface NewChecklistInput {
  vehiclePlate: string;
  driverName: string;
  driverCnh: string;
  unNumber: string;
  answers: NewChecklistAnswer[];
}

export interface ChecklistListFilters {
  vehiclePlate?: string;
}
