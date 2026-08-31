import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Checklist } from '../../domain/entities/checklist.entity.js';
import {
  CHECKLIST_REPOSITORY_PORT,
  type ChecklistRepository,
} from '../../domain/ports/checklist-repository.port.js';

@Injectable()
export class GetChecklistUseCase {
  constructor(
    @Inject(CHECKLIST_REPOSITORY_PORT) private readonly checklistRepository: ChecklistRepository,
  ) {}

  async execute(id: string): Promise<Checklist> {
    const checklist = await this.checklistRepository.findById(id);
    if (!checklist) {
      throw new NotFoundException('Checklist not found');
    }

    return checklist;
  }
}
