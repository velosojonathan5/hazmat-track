import type { Checklist, ChecklistListFilters, NewChecklistInput } from '../../domain/checklist/checklist';
import type { ChecklistRepository } from '../../domain/checklist/checklist-repository.port';
import type { ChecklistItem } from '../../domain/checklist/checklist-item';
import { apiGet, apiGetBlob, apiPost } from '../http/api-client';

export class HttpChecklistRepository implements ChecklistRepository {
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  listItems(): Promise<ChecklistItem[]> {
    return apiGet<ChecklistItem[]>('/checklists/items', { token: this.token });
  }

  submit(input: NewChecklistInput): Promise<Checklist> {
    return apiPost<Checklist>('/checklists', input, { token: this.token });
  }

  list(filters: ChecklistListFilters): Promise<Checklist[]> {
    const query = filters.vehiclePlate
      ? `?vehiclePlate=${encodeURIComponent(filters.vehiclePlate)}`
      : '';
    return apiGet<Checklist[]>(`/checklists${query}`, { token: this.token });
  }

  downloadPdf(id: string): Promise<Blob> {
    return apiGetBlob(`/checklists/${id}/pdf`, { token: this.token });
  }
}
