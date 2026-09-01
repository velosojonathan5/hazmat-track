import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CHECKLIST_PDF_GENERATOR_PORT,
  type ChecklistPdfGenerator,
} from '../../domain/ports/checklist-pdf-generator.port.js';
import {
  CHECKLIST_ITEM_REPOSITORY_PORT,
  type ChecklistItemRepository,
} from '../../domain/ports/checklist-item-repository.port.js';
import {
  CHECKLIST_REPOSITORY_PORT,
  type ChecklistRepository,
} from '../../domain/ports/checklist-repository.port.js';

@Injectable()
export class ExportChecklistPdfUseCase {
  constructor(
    @Inject(CHECKLIST_REPOSITORY_PORT) private readonly checklistRepository: ChecklistRepository,
    @Inject(CHECKLIST_ITEM_REPOSITORY_PORT) private readonly itemRepository: ChecklistItemRepository,
    @Inject(CHECKLIST_PDF_GENERATOR_PORT) private readonly pdfGenerator: ChecklistPdfGenerator,
  ) {}

  async execute(checklistId: string): Promise<Buffer> {
    const checklist = await this.checklistRepository.findById(checklistId);
    if (!checklist) {
      throw new NotFoundException('Checklist not found');
    }

    const items = await this.itemRepository.findByIds(
      checklist.answers.map((answer) => answer.itemDefinitionId),
    );

    return this.pdfGenerator.generate({ checklist, items });
  }
}
