export type ChecklistCategory = 'documentation' | 'personnel' | 'vehicle' | 'equipment' | 'cargo';

export interface ChecklistItem {
  id: string;
  category: ChecklistCategory;
  code: string;
  description: string;
}

export const CHECKLIST_CATEGORY_LABEL: Record<ChecklistCategory, string> = {
  documentation: 'Documentação',
  personnel: 'Pessoal',
  vehicle: 'Veículo',
  equipment: 'Equipamentos',
  cargo: 'Carga',
};
