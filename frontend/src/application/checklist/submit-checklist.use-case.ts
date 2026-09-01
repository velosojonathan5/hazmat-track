import type { Checklist, NewChecklistInput } from '../../domain/checklist/checklist';
import type { ChecklistRepository } from '../../domain/checklist/checklist-repository.port';

export class SubmitChecklistUseCase {
  private readonly checklistRepository: ChecklistRepository;

  constructor(checklistRepository: ChecklistRepository) {
    this.checklistRepository = checklistRepository;
  }

  execute(input: NewChecklistInput): Promise<Checklist> {
    return this.checklistRepository.submit(input);
  }
}
