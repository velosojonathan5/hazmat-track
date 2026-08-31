import type { ChecklistItemDefinition } from '../entities/checklist-item-definition.entity.js';

export const CHECKLIST_ITEM_REPOSITORY_PORT = Symbol('CHECKLIST_ITEM_REPOSITORY_PORT');

export interface ChecklistItemRepository {
  findAll(): Promise<ChecklistItemDefinition[]>;
  findByIds(ids: string[]): Promise<ChecklistItemDefinition[]>;
}
