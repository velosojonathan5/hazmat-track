export enum ChecklistCategory {
  DOCUMENTATION = 'documentation',
  PERSONNEL = 'personnel',
  VEHICLE = 'vehicle',
  EQUIPMENT = 'equipment',
  CARGO = 'cargo',
}

// `code` and `description` mirror the legal reference checklist verbatim
// (spec/forms/Lista de Verificação - Transporte de Carga Perigosa.xls), in
// Portuguese, since this is regulatory content read by Brazilian inspectors.
export interface ChecklistItemDefinition {
  id: string;
  category: ChecklistCategory;
  code: string;
  description: string;
}
