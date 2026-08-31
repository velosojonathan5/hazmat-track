import { Inject, Injectable } from '@nestjs/common';
import type { NonConformity, NonConformityStatus } from '../../domain/entities/non-conformity.entity.js';
import {
  NON_CONFORMITY_REPOSITORY_PORT,
  type NonConformityRepository,
} from '../../domain/ports/non-conformity-repository.port.js';

@Injectable()
export class ListNonConformitiesUseCase {
  constructor(
    @Inject(NON_CONFORMITY_REPOSITORY_PORT)
    private readonly nonConformityRepository: NonConformityRepository,
  ) {}

  execute(status?: NonConformityStatus): Promise<NonConformity[]> {
    return this.nonConformityRepository.findMany(status);
  }
}
