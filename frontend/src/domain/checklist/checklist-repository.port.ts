import type { Checklist, ChecklistListFilters, NewChecklistInput } from './checklist';
import type { ChecklistItem } from './checklist-item';

export interface ChecklistRepository {
  listItems(): Promise<ChecklistItem[]>;
  submit(input: NewChecklistInput): Promise<Checklist>;
  list(filters: ChecklistListFilters): Promise<Checklist[]>;
  downloadPdf(id: string): Promise<Blob>;
}
