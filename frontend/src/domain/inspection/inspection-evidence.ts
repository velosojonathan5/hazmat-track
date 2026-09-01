export type InspectionEvidenceType = 'photo' | 'video';

export interface InspectionEvidence {
  id: string;
  type: InspectionEvidenceType;
  url: string;
}

export interface NewInspectionEvidence {
  type: InspectionEvidenceType;
  url: string;
  storageKey: string;
}
