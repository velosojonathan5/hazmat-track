import { BadRequestException } from '@nestjs/common';
import { AnswerValue } from '../../domain/entities/checklist-answer.entity.js';
import { ChecklistStatus, type Checklist } from '../../domain/entities/checklist.entity.js';
import {
  ChecklistCategory,
  type ChecklistItemDefinition,
} from '../../domain/entities/checklist-item-definition.entity.js';
import type { Driver } from '../../domain/entities/driver.entity.js';
import { NonConformitySourceType, NonConformityStatus } from '../../domain/entities/non-conformity.entity.js';
import type { Vehicle } from '../../domain/entities/vehicle.entity.js';
import type { ChecklistItemRepository } from '../../domain/ports/checklist-item-repository.port.js';
import type { ChecklistRepository, NewChecklist } from '../../domain/ports/checklist-repository.port.js';
import type { DriverRepository } from '../../domain/ports/driver-repository.port.js';
import type { NonConformityRepository } from '../../domain/ports/non-conformity-repository.port.js';
import type { VehicleRepository } from '../../domain/ports/vehicle-repository.port.js';
import { SubmitChecklistUseCase } from './submit-checklist.use-case.js';

const items: ChecklistItemDefinition[] = [
  { id: 'item-1', category: ChecklistCategory.DOCUMENTATION, code: '1.1', description: 'Item 1' },
  { id: 'item-2', category: ChecklistCategory.VEHICLE, code: '3.1', description: 'Item 2' },
];

const vehicle: Vehicle = { id: 'vehicle-1', plate: 'ABC1D23' };
const driver: Driver = { id: 'driver-1', name: 'Demo Driver', cnh: '12345678900' };

function buildUseCase(overrides: {
  createdChecklist?: Checklist;
  nonConformitiesCreated?: unknown[];
} = {}) {
  const vehicleRepository: VehicleRepository = {
    findByPlate: async () => vehicle,
    findById: async () => vehicle,
    create: async (plate) => ({ id: 'new-vehicle', plate }),
  };
  const driverRepository: DriverRepository = {
    findByCnh: async () => driver,
    findById: async () => driver,
    create: async (name, cnh) => ({ id: 'new-driver', name, cnh }),
  };
  const itemRepository: ChecklistItemRepository = {
    findAll: async () => items,
    findByIds: async (ids) => items.filter((item) => ids.includes(item.id)),
  };

  let createInput: NewChecklist | undefined;
  const checklistRepository: ChecklistRepository = {
    create: async (input) => {
      createInput = input;
      return (
        overrides.createdChecklist ?? {
          id: 'checklist-1',
          vehicleId: input.vehicleId,
          driverId: input.driverId,
          unNumber: input.unNumber,
          inspectorId: input.inspectorId,
          inspectorName: input.inspectorName,
          status: input.status,
          createdAt: new Date('2026-08-31T12:00:00Z'),
          answers: input.answers.map((answer, index) => ({ id: `answer-${index}`, ...answer })),
        }
      );
    },
    findById: async () => null,
    findMany: async () => [],
  };

  const createdNonConformities: unknown[] = [];
  const nonConformityRepository: NonConformityRepository = {
    createMany: async (createItems) => {
      createdNonConformities.push(...createItems);
      return createItems.map((item, index) => ({ id: `nc-${index}`, createdAt: new Date(), ...item }));
    },
    findMany: async () => [],
  };

  const useCase = new SubmitChecklistUseCase(
    vehicleRepository,
    driverRepository,
    itemRepository,
    checklistRepository,
    nonConformityRepository,
  );

  return { useCase, createdNonConformities, getCreateInput: () => createInput };
}

describe('SubmitChecklistUseCase', () => {
  it('marks the checklist as compliant when there are no NO answers', async () => {
    const { useCase, createdNonConformities } = buildUseCase();

    const result = await useCase.execute({
      vehiclePlate: vehicle.plate,
      driverName: driver.name,
      driverCnh: driver.cnh,
      unNumber: '1230',
      inspectorId: 'inspector-1',
      inspectorName: 'Demo Inspector',
      answers: [
        { itemDefinitionId: 'item-1', answer: AnswerValue.YES },
        { itemDefinitionId: 'item-2', answer: AnswerValue.NOT_APPLICABLE },
      ],
    });

    expect(result.status).toBe(ChecklistStatus.COMPLIANT);
    expect(createdNonConformities).toHaveLength(0);
  });

  it('marks the checklist as non-compliant and creates a non-conformity for each NO answer', async () => {
    const { useCase, createdNonConformities } = buildUseCase();

    const result = await useCase.execute({
      vehiclePlate: vehicle.plate,
      driverName: driver.name,
      driverCnh: driver.cnh,
      unNumber: '1230',
      inspectorId: 'inspector-1',
      inspectorName: 'Demo Inspector',
      answers: [
        { itemDefinitionId: 'item-1', answer: AnswerValue.NO },
        { itemDefinitionId: 'item-2', answer: AnswerValue.YES },
      ],
    });

    expect(result.status).toBe(ChecklistStatus.NON_COMPLIANT);
    expect(createdNonConformities).toEqual([
      {
        sourceType: NonConformitySourceType.CHECKLIST,
        sourceId: 'checklist-1',
        description: '1.1 - Item 1',
        status: NonConformityStatus.OPEN,
      },
    ]);
  });

  it('rejects answers that reference unknown checklist items', async () => {
    const { useCase } = buildUseCase();

    await expect(
      useCase.execute({
        vehiclePlate: vehicle.plate,
        driverName: driver.name,
        driverCnh: driver.cnh,
        unNumber: '1230',
        inspectorId: 'inspector-1',
        inspectorName: 'Demo Inspector',
        answers: [{ itemDefinitionId: 'unknown-item', answer: AnswerValue.YES }],
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
