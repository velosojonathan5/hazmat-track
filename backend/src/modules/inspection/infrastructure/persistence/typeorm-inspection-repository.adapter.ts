import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, type Repository } from 'typeorm';
import type { InspectionEvidence } from '../../domain/entities/inspection-evidence.entity.js';
import type { Inspection, RingelmannGrade } from '../../domain/entities/inspection.entity.js';
import type {
  InspectionFilters,
  InspectionRepository,
  NewInspection,
} from '../../domain/ports/inspection-repository.port.js';
import { InspectionEvidenceOrmEntity } from './inspection-evidence.orm-entity.js';
import { InspectionOrmEntity } from './inspection.orm-entity.js';

const WITH_EVIDENCES = { evidences: true } as const;

@Injectable()
export class TypeOrmInspectionRepository implements InspectionRepository {
  constructor(
    @InjectRepository(InspectionOrmEntity) private readonly repository: Repository<InspectionOrmEntity>,
  ) {}

  async create(input: NewInspection): Promise<Inspection> {
    const entity = this.repository.create({
      vehiclePlate: input.vehiclePlate,
      unNumber: input.unNumber,
      inspectorId: input.inspectorId,
      inspectorName: input.inspectorName,
      latitude: input.latitude,
      longitude: input.longitude,
      ringelmannGrade: input.ringelmannGrade ?? null,
      comments: input.comments ?? null,
      evidences: input.evidences.map((evidence) =>
        Object.assign(new InspectionEvidenceOrmEntity(), evidence),
      ),
    });

    const saved = await this.repository.save(entity);
    const persisted = await this.repository.findOneOrFail({
      where: { id: saved.id },
      relations: WITH_EVIDENCES,
    });
    return this.toDomain(persisted);
  }

  async findById(id: string): Promise<Inspection | null> {
    const entity = await this.repository.findOne({ where: { id }, relations: WITH_EVIDENCES });
    return entity ? this.toDomain(entity) : null;
  }

  async findMany(filters: InspectionFilters): Promise<Inspection[]> {
    const entities = await this.repository.find({
      where: {
        ...(filters.vehiclePlate ? { vehiclePlate: filters.vehiclePlate } : {}),
        ...(filters.unNumber ? { unNumber: filters.unNumber } : {}),
        ...(filters.from && filters.to ? { createdAt: Between(filters.from, filters.to) } : {}),
      },
      relations: WITH_EVIDENCES,
      order: { createdAt: 'DESC' },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  private toDomain(entity: InspectionOrmEntity): Inspection {
    return {
      id: entity.id,
      vehiclePlate: entity.vehiclePlate,
      unNumber: entity.unNumber,
      inspectorId: entity.inspectorId,
      inspectorName: entity.inspectorName,
      latitude: entity.latitude,
      longitude: entity.longitude,
      ringelmannGrade: (entity.ringelmannGrade ?? undefined) as RingelmannGrade | undefined,
      comments: entity.comments ?? undefined,
      createdAt: entity.createdAt,
      evidences: entity.evidences.map(
        (evidence): InspectionEvidence => ({
          id: evidence.id,
          type: evidence.type,
          url: evidence.url,
          storageKey: evidence.storageKey,
        }),
      ),
    };
  }
}
