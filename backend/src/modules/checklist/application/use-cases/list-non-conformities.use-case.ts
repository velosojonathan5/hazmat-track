import { Inject, Injectable } from '@nestjs/common';
import type { NonConformity } from '../../domain/entities/non-conformity.entity.js';
import {
  NON_CONFORMITY_REPOSITORY_PORT,
  type NonConformityFilters,
  type NonConformityRepository,
} from '../../domain/ports/non-conformity-repository.port.js';

@Injectable()
export class ListNonConformitiesUseCase {
  constructor(
    @Inject(NON_CONFORMITY_REPOSITORY_PORT)
    private readonly nonConformityRepository: NonConformityRepository,
  ) {}

  execute(filters: NonConformityFilters): Promise<NonConformity[]> {
    return this.nonConformityRepository.findMany(filters);
  }
}
