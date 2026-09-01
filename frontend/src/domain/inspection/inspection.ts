import type { InspectionEvidence, NewInspectionEvidence } from './inspection-evidence';

export type RingelmannGrade = 0 | 1 | 2 | 3 | 4 | 5;

export const RINGELMANN_DENSITY: Record<RingelmannGrade, string> = {
  0: '0%',
  1: '20%',
  2: '40%',
  3: '60%',
  4: '80%',
  5: '100%',
};

export interface Inspection {
  id: string;
  vehiclePlate: string;
  unNumber: string;
  inspectorId: string;
  inspectorName: string;
  latitude: number;
  longitude: number;
  ringelmannGrade?: RingelmannGrade;
  comments?: string;
  createdAt: string;
  evidences: InspectionEvidence[];
}

export interface NewInspectionInput {
  vehiclePlate: string;
  unNumber: string;
  latitude: number;
  longitude: number;
  ringelmannGrade?: RingelmannGrade;
  comments?: string;
  evidences: NewInspectionEvidence[];
}

export interface InspectionListFilters {
  vehiclePlate?: string;
}
