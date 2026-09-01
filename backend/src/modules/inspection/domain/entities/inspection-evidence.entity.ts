export enum InspectionEvidenceType {
  PHOTO = 'photo',
  VIDEO = 'video',
}

export interface InspectionEvidence {
  id: string;
  type: InspectionEvidenceType;
  url: string;
  storageKey: string;
}
