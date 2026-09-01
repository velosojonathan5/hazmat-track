import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { ExportChecklistPdfUseCase } from './application/use-cases/export-checklist-pdf.use-case.js';
import { GetChecklistUseCase } from './application/use-cases/get-checklist.use-case.js';
import { ListChecklistItemsUseCase } from './application/use-cases/list-checklist-items.use-case.js';
import { ListChecklistsUseCase } from './application/use-cases/list-checklists.use-case.js';
import { ListNonConformitiesUseCase } from './application/use-cases/list-non-conformities.use-case.js';
import { SubmitChecklistUseCase } from './application/use-cases/submit-checklist.use-case.js';
import { CHECKLIST_ITEM_REPOSITORY_PORT } from './domain/ports/checklist-item-repository.port.js';
import { CHECKLIST_PDF_GENERATOR_PORT } from './domain/ports/checklist-pdf-generator.port.js';
import { CHECKLIST_REPOSITORY_PORT } from './domain/ports/checklist-repository.port.js';
import { DRIVER_REPOSITORY_PORT } from './domain/ports/driver-repository.port.js';
import { NON_CONFORMITY_REPOSITORY_PORT } from './domain/ports/non-conformity-repository.port.js';
import { VEHICLE_REPOSITORY_PORT } from './domain/ports/vehicle-repository.port.js';
import { ChecklistController } from './infrastructure/http/checklist.controller.js';
import { PdfKitChecklistPdfGenerator } from './infrastructure/pdf/pdfkit-checklist-pdf-generator.adapter.js';
import { ChecklistAnswerOrmEntity } from './infrastructure/persistence/checklist-answer.orm-entity.js';
import { ChecklistItemDefinitionOrmEntity } from './infrastructure/persistence/checklist-item-definition.orm-entity.js';
import { ChecklistOrmEntity } from './infrastructure/persistence/checklist.orm-entity.js';
import { DriverOrmEntity } from './infrastructure/persistence/driver.orm-entity.js';
import { NonConformityOrmEntity } from './infrastructure/persistence/non-conformity.orm-entity.js';
import { TypeOrmChecklistItemRepository } from './infrastructure/persistence/typeorm-checklist-item-repository.adapter.js';
import { TypeOrmChecklistRepository } from './infrastructure/persistence/typeorm-checklist-repository.adapter.js';
import { TypeOrmDriverRepository } from './infrastructure/persistence/typeorm-driver-repository.adapter.js';
import { TypeOrmNonConformityRepository } from './infrastructure/persistence/typeorm-non-conformity-repository.adapter.js';
import { TypeOrmVehicleRepository } from './infrastructure/persistence/typeorm-vehicle-repository.adapter.js';
import { VehicleOrmEntity } from './infrastructure/persistence/vehicle.orm-entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VehicleOrmEntity,
      DriverOrmEntity,
      ChecklistItemDefinitionOrmEntity,
      ChecklistOrmEntity,
      ChecklistAnswerOrmEntity,
      NonConformityOrmEntity,
    ]),
    AuthModule,
  ],
  controllers: [ChecklistController],
  providers: [
    ListChecklistItemsUseCase,
    SubmitChecklistUseCase,
    ListChecklistsUseCase,
    GetChecklistUseCase,
    ExportChecklistPdfUseCase,
    ListNonConformitiesUseCase,
    { provide: VEHICLE_REPOSITORY_PORT, useClass: TypeOrmVehicleRepository },
    { provide: DRIVER_REPOSITORY_PORT, useClass: TypeOrmDriverRepository },
    { provide: CHECKLIST_ITEM_REPOSITORY_PORT, useClass: TypeOrmChecklistItemRepository },
    { provide: CHECKLIST_REPOSITORY_PORT, useClass: TypeOrmChecklistRepository },
    { provide: NON_CONFORMITY_REPOSITORY_PORT, useClass: TypeOrmNonConformityRepository },
    { provide: CHECKLIST_PDF_GENERATOR_PORT, useClass: PdfKitChecklistPdfGenerator },
  ],
  exports: [CHECKLIST_REPOSITORY_PORT, NON_CONFORMITY_REPOSITORY_PORT],
})
export class ChecklistModule {}
