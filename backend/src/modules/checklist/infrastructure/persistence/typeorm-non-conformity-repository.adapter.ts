import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, type Repository } from 'typeorm';
import type { NonConformity } from '../../domain/entities/non-conformity.entity.js';
import type {
  NewNonConformity,
  NonConformityFilters,
  NonConformityRepository,
} from '../../domain/ports/non-conformity-repository.port.js';
import { NonConformityOrmEntity } from './non-conformity.orm-entity.js';

@Injectable()
export class TypeOrmNonConformityRepository implements NonConformityRepository {
  constructor(
    @InjectRepository(NonConformityOrmEntity)
    private readonly repository: Repository<NonConformityOrmEntity>,
  ) {}

  async createMany(items: NewNonConformity[]): Promise<NonConformity[]> {
    const entities = items.map((item) => this.repository.create(item));
    const saved = await this.repository.save(entities);
    return saved.map(this.toDomain);
  }

  async findMany(filters: NonConformityFilters): Promise<NonConformity[]> {
    const entities = await this.repository.find({
      where: {
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.from && filters.to ? { createdAt: Between(filters.from, filters.to) } : {}),
      },
      order: { createdAt: 'DESC' },
    });
    return entities.map(this.toDomain);
  }

  private toDomain(entity: NonConformityOrmEntity): NonConformity {
    return {
      id: entity.id,
      sourceType: entity.sourceType,
      sourceId: entity.sourceId,
      category: entity.category,
      description: entity.description,
      status: entity.status,
      createdAt: entity.createdAt,
    };
  }
}
