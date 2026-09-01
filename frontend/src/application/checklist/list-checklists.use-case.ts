import type { Checklist, ChecklistListFilters } from '../../domain/checklist/checklist';
import type { ChecklistRepository } from '../../domain/checklist/checklist-repository.port';

export class ListChecklistsUseCase {
  private readonly checklistRepository: ChecklistRepository;

  constructor(checklistRepository: ChecklistRepository) {
    this.checklistRepository = checklistRepository;
  }

  execute(filters: ChecklistListFilters): Promise<Checklist[]> {
    return this.checklistRepository.list(filters);
  }
}
