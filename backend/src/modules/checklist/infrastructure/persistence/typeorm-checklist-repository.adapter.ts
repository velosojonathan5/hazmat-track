import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, type Repository } from 'typeorm';
import type { ChecklistAnswer } from '../../domain/entities/checklist-answer.entity.js';
import type { Checklist } from '../../domain/entities/checklist.entity.js';
import type {
  ChecklistFilters,
  ChecklistRepository,
  NewChecklist,
} from '../../domain/ports/checklist-repository.port.js';
import { ChecklistAnswerOrmEntity } from './checklist-answer.orm-entity.js';
import { ChecklistOrmEntity } from './checklist.orm-entity.js';
import { VehicleOrmEntity } from './vehicle.orm-entity.js';

const ANSWERS_WITH_ITEM_RELATIONS = { answers: { itemDefinition: true } } as const;

@Injectable()
export class TypeOrmChecklistRepository implements ChecklistRepository {
  constructor(
    @InjectRepository(ChecklistOrmEntity) private readonly repository: Repository<ChecklistOrmEntity>,
    @InjectRepository(VehicleOrmEntity) private readonly vehicleRepository: Repository<VehicleOrmEntity>,
  ) {}

  async create(input: NewChecklist): Promise<Checklist> {
    const entity = this.repository.create({
      vehicleId: input.vehicleId,
      driverId: input.driverId,
      unNumber: input.unNumber,
      inspectorId: input.inspectorId,
      inspectorName: input.inspectorName,
      status: input.status,
      answers: input.answers.map((answer) =>
        Object.assign(new ChecklistAnswerOrmEntity(), {
          itemDefinition: { id: answer.itemDefinitionId },
          answer: answer.answer,
          note: answer.note ?? null,
          photoUrl: answer.photoUrl ?? null,
        }),
      ),
    });

    const saved = await this.repository.save(entity);
    const persisted = await this.repository.findOneOrFail({
      where: { id: saved.id },
      relations: ANSWERS_WITH_ITEM_RELATIONS,
    });
    return this.toDomain(persisted);
  }

  async findById(id: string): Promise<Checklist | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ANSWERS_WITH_ITEM_RELATIONS,
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findMany(filters: ChecklistFilters): Promise<Checklist[]> {
    const vehicleId = filters.vehiclePlate ? await this.resolveVehicleId(filters.vehiclePlate) : undefined;
    if (filters.vehiclePlate && !vehicleId) {
      return [];
    }

    const entities = await this.repository.find({
      where: {
        ...(filters.driverId ? { driverId: filters.driverId } : {}),
        ...(vehicleId ? { vehicleId } : {}),
        ...(filters.from && filters.to ? { createdAt: Between(filters.from, filters.to) } : {}),
      },
      relations: ANSWERS_WITH_ITEM_RELATIONS,
      order: { createdAt: 'DESC' },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  private async resolveVehicleId(plate: string): Promise<string | undefined> {
    const vehicle = await this.vehicleRepository.findOne({ where: { plate } });
    return vehicle?.id;
  }

  private toDomain(entity: ChecklistOrmEntity): Checklist {
    return {
      id: entity.id,
      vehicleId: entity.vehicleId,
      driverId: entity.driverId,
      unNumber: entity.unNumber,
      inspectorId: entity.inspectorId,
      inspectorName: entity.inspectorName,
      status: entity.status,
      createdAt: entity.createdAt,
      answers: entity.answers.map(
        (answer): ChecklistAnswer => ({
          id: answer.id,
          itemDefinitionId: answer.itemDefinition.id,
          answer: answer.answer,
          note: answer.note ?? undefined,
          photoUrl: answer.photoUrl ?? undefined,
        }),
      ),
    };
  }
}
