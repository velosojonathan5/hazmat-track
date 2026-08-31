import type { ChecklistItemDefinition } from '../entities/checklist-item-definition.entity.js';
import type { Checklist } from '../entities/checklist.entity.js';
import type { Driver } from '../entities/driver.entity.js';
import type { Vehicle } from '../entities/vehicle.entity.js';

export const CHECKLIST_PDF_GENERATOR_PORT = Symbol('CHECKLIST_PDF_GENERATOR_PORT');

export interface ChecklistPdfData {
  checklist: Checklist;
  items: ChecklistItemDefinition[];
  vehicle: Vehicle;
  driver: Driver;
}

export interface ChecklistPdfGenerator {
  generate(data: ChecklistPdfData): Promise<Buffer>;
}
