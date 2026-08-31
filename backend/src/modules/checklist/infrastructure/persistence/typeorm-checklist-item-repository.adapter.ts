import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, type Repository } from 'typeorm';
import type { ChecklistItemDefinition } from '../../domain/entities/checklist-item-definition.entity.js';
import type { ChecklistItemRepository } from '../../domain/ports/checklist-item-repository.port.js';
import { ChecklistItemDefinitionOrmEntity } from './checklist-item-definition.orm-entity.js';

@Injectable()
export class TypeOrmChecklistItemRepository implements ChecklistItemRepository {
  constructor(
    @InjectRepository(ChecklistItemDefinitionOrmEntity)
    private readonly repository: Repository<ChecklistItemDefinitionOrmEntity>,
  ) {}

  async findAll(): Promise<ChecklistItemDefinition[]> {
    const entities = await this.repository.find({ order: { code: 'ASC' } });
    return entities.map(this.toDomain);
  }

  async findByIds(ids: string[]): Promise<ChecklistItemDefinition[]> {
    if (ids.length === 0) {
      return [];
    }

    const entities = await this.repository.find({ where: { id: In(ids) } });
    return entities.map(this.toDomain);
  }

  private toDomain(entity: ChecklistItemDefinitionOrmEntity): ChecklistItemDefinition {
    return {
      id: entity.id,
      category: entity.category,
      code: entity.code,
      description: entity.description,
    };
  }
}
