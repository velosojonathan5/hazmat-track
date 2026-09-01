import { Inject, Injectable, Logger } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { FILE_STORAGE_PORT, type FileStoragePort } from '../../../../shared/storage/domain/file-storage.port.js';
import { InspectionEvidenceType } from '../../domain/entities/inspection-evidence.entity.js';
import type { Inspection } from '../../domain/entities/inspection.entity.js';
import type { InspectionPdfGenerator } from '../../domain/ports/inspection-pdf-generator.port.js';

const RINGELMANN_DENSITY: Record<number, string> = {
  0: '0%',
  1: '20%',
  2: '40%',
  3: '60%',
  4: '80%',
  5: '100%',
};

@Injectable()
export class PdfKitInspectionPdfGenerator implements InspectionPdfGenerator {
  private readonly logger = new Logger(PdfKitInspectionPdfGenerator.name);

  constructor(@Inject(FILE_STORAGE_PORT) private readonly fileStorage: FileStoragePort) {}

  async generate(inspection: Inspection): Promise<Buffer> {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    const done = new Promise<Buffer>((resolve, reject) => {
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });

    doc.fontSize(16).text('HazmatTrack - Laudo de Fiscalização Ambiental', { align: 'center' });
    doc.moveDown();

    doc.fontSize(10);
    doc.text(`Veículo (placa): ${inspection.vehiclePlate}`);
    doc.text(`Número ONU: ${inspection.unNumber}`);
    doc.text(`Inspetor responsável: ${inspection.inspectorName}`);
    doc.text(`Data/hora: ${inspection.createdAt.toLocaleString('pt-BR')}`);
    doc.text(`Geolocalização: ${inspection.latitude}, ${inspection.longitude}`);
    doc.text(
      `Escala de Ringelmann: ${
        inspection.ringelmannGrade === undefined
          ? 'não avaliada'
          : `grau ${inspection.ringelmannGrade} (${RINGELMANN_DENSITY[inspection.ringelmannGrade]} de densidade de fumaça)`
      }`,
    );
    if (inspection.comments) {
      doc.text(`Observações: ${inspection.comments}`);
    }
    doc.moveDown();

    doc.fontSize(12).text('Evidências', { underline: true });
    doc.moveDown(0.5);

    for (const evidence of inspection.evidences) {
      if (evidence.type === InspectionEvidenceType.PHOTO) {
        await this.embedPhoto(doc, evidence.storageKey, evidence.url);
      } else {
        doc.fontSize(9).fillColor('blue').text(`Vídeo: ${evidence.url}`).fillColor('black');
      }
      doc.moveDown(0.5);
    }

    doc.end();
    return done;
  }

  private async embedPhoto(doc: PDFKit.PDFDocument, storageKey: string, url: string): Promise<void> {
    try {
      const bytes = await this.fileStorage.download(storageKey);
      doc.image(bytes, { fit: [220, 220] });
    } catch (error) {
      this.logger.warn(`Could not embed photo "${storageKey}" in the PDF, listing the link instead`, error);
      doc.fontSize(9).fillColor('blue').text(`Foto: ${url}`).fillColor('black');
    }
  }
}
