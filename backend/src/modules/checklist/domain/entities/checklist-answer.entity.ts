export enum AnswerValue {
  YES = 'yes',
  NO = 'no',
  NOT_APPLICABLE = 'not_applicable',
}

export interface ChecklistAnswer {
  id: string;
  itemDefinitionId: string;
  answer: AnswerValue;
  note?: string;
  photoUrl?: string;
}
