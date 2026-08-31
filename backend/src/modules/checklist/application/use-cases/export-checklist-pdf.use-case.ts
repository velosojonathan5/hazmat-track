import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CHECKLIST_PDF_GENERATOR_PORT,
  type ChecklistPdfGenerator,
} from '../../domain/ports/checklist-pdf-generator.port.js';
import {
  CHECKLIST_ITEM_REPOSITORY_PORT,
  type ChecklistItemRepository,
} from '../../domain/ports/checklist-item-repository.port.js';
import {
  CHECKLIST_REPOSITORY_PORT,
  type ChecklistRepository,
} from '../../domain/ports/checklist-repository.port.js';
import { DRIVER_REPOSITORY_PORT, type DriverRepository } from '../../domain/ports/driver-repository.port.js';
import { VEHICLE_REPOSITORY_PORT, type VehicleRepository } from '../../domain/ports/vehicle-repository.port.js';

@Injectable()
export class ExportChecklistPdfUseCase {
  constructor(
    @Inject(CHECKLIST_REPOSITORY_PORT) private readonly checklistRepository: ChecklistRepository,
    @Inject(CHECKLIST_ITEM_REPOSITORY_PORT) private readonly itemRepository: ChecklistItemRepository,
    @Inject(VEHICLE_REPOSITORY_PORT) private readonly vehicleRepository: VehicleRepository,
    @Inject(DRIVER_REPOSITORY_PORT) private readonly driverRepository: DriverRepository,
    @Inject(CHECKLIST_PDF_GENERATOR_PORT) private readonly pdfGenerator: ChecklistPdfGenerator,
  ) {}

  async execute(checklistId: string): Promise<Buffer> {
    const checklist = await this.checklistRepository.findById(checklistId);
    if (!checklist) {
      throw new NotFoundException('Checklist not found');
    }

    const [items, vehicle, driver] = await Promise.all([
      this.itemRepository.findByIds(checklist.answers.map((answer) => answer.itemDefinitionId)),
      this.vehicleRepository.findById(checklist.vehicleId),
      this.driverRepository.findById(checklist.driverId),
    ]);

    if (!vehicle || !driver) {
      throw new NotFoundException('Vehicle or driver not found for this checklist');
    }

    return this.pdfGenerator.generate({ checklist, items, vehicle, driver });
  }
}
