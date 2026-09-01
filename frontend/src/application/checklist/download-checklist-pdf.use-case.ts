import type { ChecklistRepository } from '../../domain/checklist/checklist-repository.port';

export class DownloadChecklistPdfUseCase {
  private readonly checklistRepository: ChecklistRepository;

  constructor(checklistRepository: ChecklistRepository) {
    this.checklistRepository = checklistRepository;
  }

  execute(id: string): Promise<Blob> {
    return this.checklistRepository.downloadPdf(id);
  }
}
