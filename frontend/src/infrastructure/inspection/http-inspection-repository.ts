import type { Inspection, InspectionListFilters, NewInspectionInput } from '../../domain/inspection/inspection';
import type { InspectionRepository } from '../../domain/inspection/inspection-repository.port';
import { apiGet, apiGetBlob, apiPost } from '../http/api-client';

export class HttpInspectionRepository implements InspectionRepository {
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  register(input: NewInspectionInput): Promise<Inspection> {
    return apiPost<Inspection>('/inspections', input, { token: this.token });
  }

  list(filters: InspectionListFilters): Promise<Inspection[]> {
    const query = filters.vehiclePlate
      ? `?vehiclePlate=${encodeURIComponent(filters.vehiclePlate)}`
      : '';
    return apiGet<Inspection[]>(`/inspections${query}`, { token: this.token });
  }

  downloadPdf(id: string): Promise<Blob> {
    return apiGetBlob(`/inspections/${id}/pdf`, { token: this.token });
  }
}
