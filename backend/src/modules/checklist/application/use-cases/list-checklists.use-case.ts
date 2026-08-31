import { Inject, Injectable } from '@nestjs/common';
import type { Checklist } from '../../domain/entities/checklist.entity.js';
import {
  CHECKLIST_REPOSITORY_PORT,
  type ChecklistFilters,
  type ChecklistRepository,
} from '../../domain/ports/checklist-repository.port.js';

@Injectable()
export class ListChecklistsUseCase {
  constructor(
    @Inject(CHECKLIST_REPOSITORY_PORT) private readonly checklistRepository: ChecklistRepository,
  ) {}

  execute(filters: ChecklistFilters): Promise<Checklist[]> {
    return this.checklistRepository.findMany(filters);
  }
}
