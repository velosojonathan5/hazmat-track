import type { ChecklistCategory } from './checklist-item-definition.entity.js';

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
  category: ChecklistCategory;
  description: string;
  status: NonConformityStatus;
  createdAt: Date;
}
