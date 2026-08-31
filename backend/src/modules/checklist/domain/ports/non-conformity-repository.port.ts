import type {
  NonConformity,
  NonConformitySourceType,
  NonConformityStatus,
} from '../entities/non-conformity.entity.js';

export const NON_CONFORMITY_REPOSITORY_PORT = Symbol('NON_CONFORMITY_REPOSITORY_PORT');

export interface NewNonConformity {
  sourceType: NonConformitySourceType;
  sourceId: string;
  description: string;
  status: NonConformityStatus;
}

export interface NonConformityRepository {
  createMany(items: NewNonConformity[]): Promise<NonConformity[]>;
  findMany(status?: NonConformityStatus): Promise<NonConformity[]>;
}
