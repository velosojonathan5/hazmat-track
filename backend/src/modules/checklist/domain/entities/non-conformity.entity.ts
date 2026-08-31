export enum NonConformitySourceType {
  CHECKLIST = 'checklist',
}

export enum NonConformityStatus {
  OPEN = 'open',
  RESOLVED = 'resolved',
}

export interface NonConformity {
  id: string;
  sourceType: NonConformitySourceType;
  sourceId: string;
  description: string;
  status: NonConformityStatus;
  createdAt: Date;
}
