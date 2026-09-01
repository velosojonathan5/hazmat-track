import type { ChecklistItemDefinition } from '../entities/checklist-item-definition.entity.js';
import type { Checklist } from '../entities/checklist.entity.js';

export const CHECKLIST_PDF_GENERATOR_PORT = Symbol('CHECKLIST_PDF_GENERATOR_PORT');

export interface ChecklistPdfData {
  checklist: Checklist;
  items: ChecklistItemDefinition[];
}

export interface ChecklistPdfGenerator {
  generate(data: ChecklistPdfData): Promise<Buffer>;
}
