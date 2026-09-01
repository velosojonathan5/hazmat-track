import type { InspectionEvidence } from './inspection-evidence.entity.js';

// Ringelmann Chart grades (0-5), each representing an approximate percentage
// of black smoke density: 0=0%, 1=20%, 2=40%, 3=60%, 4=80%, 5=100%.
export type RingelmannGrade = 0 | 1 | 2 | 3 | 4 | 5;

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
  createdAt: Date;
  evidences: InspectionEvidence[];
}
