import { Inject, Injectable } from '@nestjs/common';
import type { ChecklistItemDefinition } from '../../domain/entities/checklist-item-definition.entity.js';
import {
  CHECKLIST_ITEM_REPOSITORY_PORT,
  type ChecklistItemRepository,
} from '../../domain/ports/checklist-item-repository.port.js';

@Injectable()
export class ListChecklistItemsUseCase {
  constructor(
    @Inject(CHECKLIST_ITEM_REPOSITORY_PORT) private readonly itemRepository: ChecklistItemRepository,
  ) {}

  execute(): Promise<ChecklistItemDefinition[]> {
    return this.itemRepository.findAll();
  }
}
