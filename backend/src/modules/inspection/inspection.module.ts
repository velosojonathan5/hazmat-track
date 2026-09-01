import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { StorageModule } from '../../shared/storage/storage.module.js';
import { ExportInspectionPdfUseCase } from './application/use-cases/export-inspection-pdf.use-case.js';
import { GetInspectionUseCase } from './application/use-cases/get-inspection.use-case.js';
import { ListInspectionsUseCase } from './application/use-cases/list-inspections.use-case.js';
import { RegisterInspectionUseCase } from './application/use-cases/register-inspection.use-case.js';
import { INSPECTION_PDF_GENERATOR_PORT } from './domain/ports/inspection-pdf-generator.port.js';
import { INSPECTION_REPOSITORY_PORT } from './domain/ports/inspection-repository.port.js';
import { InspectionController } from './infrastructure/http/inspection.controller.js';
import { PdfKitInspectionPdfGenerator } from './infrastructure/pdf/pdfkit-inspection-pdf-generator.adapter.js';
import { InspectionEvidenceOrmEntity } from './infrastructure/persistence/inspection-evidence.orm-entity.js';
import { InspectionOrmEntity } from './infrastructure/persistence/inspection.orm-entity.js';
import { TypeOrmInspectionRepository } from './infrastructure/persistence/typeorm-inspection-repository.adapter.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([InspectionOrmEntity, InspectionEvidenceOrmEntity]),
    AuthModule,
    StorageModule,
  ],
  controllers: [InspectionController],
  providers: [
    RegisterInspectionUseCase,
    ListInspectionsUseCase,
    GetInspectionUseCase,
    ExportInspectionPdfUseCase,
    { provide: INSPECTION_REPOSITORY_PORT, useClass: TypeOrmInspectionRepository },
    { provide: INSPECTION_PDF_GENERATOR_PORT, useClass: PdfKitInspectionPdfGenerator },
  ],
})
export class InspectionModule {}
