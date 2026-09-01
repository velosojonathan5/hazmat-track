import type { Inspection, InspectionListFilters, NewInspectionInput } from './inspection';

export interface InspectionRepository {
  register(input: NewInspectionInput): Promise<Inspection>;
  list(filters: InspectionListFilters): Promise<Inspection[]>;
  downloadPdf(id: string): Promise<Blob>;
}
