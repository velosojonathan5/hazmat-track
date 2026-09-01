import type { ChecklistRepository } from '../../domain/checklist/checklist-repository.port';
import type { ChecklistItem } from '../../domain/checklist/checklist-item';

export class ListChecklistItemsUseCase {
  private readonly checklistRepository: ChecklistRepository;

  constructor(checklistRepository: ChecklistRepository) {
    this.checklistRepository = checklistRepository;
  }

  execute(): Promise<ChecklistItem[]> {
    return this.checklistRepository.listItems();
  }
}
