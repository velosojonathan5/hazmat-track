import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  INSPECTION_PDF_GENERATOR_PORT,
  type InspectionPdfGenerator,
} from '../../domain/ports/inspection-pdf-generator.port.js';
import {
  INSPECTION_REPOSITORY_PORT,
  type InspectionRepository,
} from '../../domain/ports/inspection-repository.port.js';

@Injectable()
export class ExportInspectionPdfUseCase {
  constructor(
    @Inject(INSPECTION_REPOSITORY_PORT) private readonly inspectionRepository: InspectionRepository,
    @Inject(INSPECTION_PDF_GENERATOR_PORT) private readonly pdfGenerator: InspectionPdfGenerator,
  ) {}

  async execute(id: string): Promise<Buffer> {
    const inspection = await this.inspectionRepository.findById(id);
    if (!inspection) {
      throw new NotFoundException('Inspection not found');
    }

    return this.pdfGenerator.generate(inspection);
  }
}
