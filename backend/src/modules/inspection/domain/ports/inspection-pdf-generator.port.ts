import type { Inspection } from '../entities/inspection.entity.js';

export const INSPECTION_PDF_GENERATOR_PORT = Symbol('INSPECTION_PDF_GENERATOR_PORT');

export interface InspectionPdfGenerator {
  generate(inspection: Inspection): Promise<Buffer>;
}
