import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AnswerValue } from '../../domain/entities/checklist-answer.entity.js';
import type { ChecklistItemDefinition } from '../../domain/entities/checklist-item-definition.entity.js';
import { Checklist, ChecklistStatus } from '../../domain/entities/checklist.entity.js';
import type { Driver } from '../../domain/entities/driver.entity.js';
import {
  NonConformitySourceType,
  NonConformityStatus,
} from '../../domain/entities/non-conformity.entity.js';
import type { Vehicle } from '../../domain/entities/vehicle.entity.js';
import {
  CHECKLIST_ITEM_REPOSITORY_PORT,
  type ChecklistItemRepository,
} from '../../domain/ports/checklist-item-repository.port.js';
import {
  CHECKLIST_REPOSITORY_PORT,
  type ChecklistRepository,
  type NewChecklistAnswer,
} from '../../domain/ports/checklist-repository.port.js';
import { DRIVER_REPOSITORY_PORT, type DriverRepository } from '../../domain/ports/driver-repository.port.js';
import {
  NON_CONFORMITY_REPOSITORY_PORT,
  type NonConformityRepository,
} from '../../domain/ports/non-conformity-repository.port.js';
import { VEHICLE_REPOSITORY_PORT, type VehicleRepository } from '../../domain/ports/vehicle-repository.port.js';

export interface SubmitChecklistInput {
  vehiclePlate: string;
  driverName: string;
  driverCnh: string;
  unNumber: string;
  inspectorId: string;
  inspectorName: string;
  answers: NewChecklistAnswer[];
}

@Injectable()
export class SubmitChecklistUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY_PORT) private readonly vehicleRepository: VehicleRepository,
    @Inject(DRIVER_REPOSITORY_PORT) private readonly driverRepository: DriverRepository,
    @Inject(CHECKLIST_ITEM_REPOSITORY_PORT) private readonly itemRepository: ChecklistItemRepository,
    @Inject(CHECKLIST_REPOSITORY_PORT) private readonly checklistRepository: ChecklistRepository,
    @Inject(NON_CONFORMITY_REPOSITORY_PORT)
    private readonly nonConformityRepository: NonConformityRepository,
  ) {}

  async execute(input: SubmitChecklistInput): Promise<Checklist> {
    const validItems = await this.itemRepository.findByIds(
      input.answers.map((answer) => answer.itemDefinitionId),
    );
    if (validItems.length !== input.answers.length) {
      throw new BadRequestException('One or more checklist items are invalid');
    }

    const [vehicle, driver] = await Promise.all([
      this.getOrCreateVehicle(input.vehiclePlate),
      this.getOrCreateDriver(input.driverName, input.driverCnh),
    ]);

    const status = input.answers.some((answer) => answer.answer === AnswerValue.NO)
      ? ChecklistStatus.NON_COMPLIANT
      : ChecklistStatus.COMPLIANT;

    const checklist = await this.checklistRepository.create({
      vehicleId: vehicle.id,
      vehiclePlate: vehicle.plate,
      driverId: driver.id,
      driverName: driver.name,
      driverCnh: driver.cnh,
      unNumber: input.unNumber,
      inspectorId: input.inspectorId,
      inspectorName: input.inspectorName,
      status,
      answers: input.answers,
    });

    await this.createNonConformities(checklist.id, input.answers, validItems);

    return checklist;
  }

  private async createNonConformities(
    checklistId: string,
    answers: NewChecklistAnswer[],
    items: ChecklistItemDefinition[],
  ): Promise<void> {
    const failedItemIds = new Set(
      answers.filter((answer) => answer.answer === AnswerValue.NO).map((answer) => answer.itemDefinitionId),
    );
    if (failedItemIds.size === 0) {
      return;
    }

    const failedItems = items.filter((item) => failedItemIds.has(item.id));
    await this.nonConformityRepository.createMany(
      failedItems.map((item) => ({
        sourceType: NonConformitySourceType.CHECKLIST,
        sourceId: checklistId,
        category: item.category,
        description: `${item.code} - ${item.description}`,
        status: NonConformityStatus.OPEN,
      })),
    );
  }

  private async getOrCreateVehicle(plate: string): Promise<Vehicle> {
    const existing = await this.vehicleRepository.findByPlate(plate);
    return existing ?? this.vehicleRepository.create(plate);
  }

  private async getOrCreateDriver(name: string, cnh: string): Promise<Driver> {
    const existing = await this.driverRepository.findByCnh(cnh);
    return existing ?? this.driverRepository.create(name, cnh);
  }
}
