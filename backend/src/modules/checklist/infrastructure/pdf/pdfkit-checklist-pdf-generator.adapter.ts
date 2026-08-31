import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { AnswerValue } from '../../domain/entities/checklist-answer.entity.js';
import { ChecklistStatus } from '../../domain/entities/checklist.entity.js';
import type {
  ChecklistPdfData,
  ChecklistPdfGenerator,
} from '../../domain/ports/checklist-pdf-generator.port.js';

const ANSWER_LABEL: Record<AnswerValue, string> = {
  [AnswerValue.YES]: 'SIM',
  [AnswerValue.NO]: 'NÃO',
  [AnswerValue.NOT_APPLICABLE]: 'N.A.',
};

@Injectable()
export class PdfKitChecklistPdfGenerator implements ChecklistPdfGenerator {
  generate(data: ChecklistPdfData): Promise<Buffer> {
    const { checklist, items, vehicle, driver } = data;
    const itemsById = new Map(items.map((item) => [item.id, item]));

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(16).text('HazmatTrack - Checklist de Veículo', { align: 'center' });
      doc.moveDown();

      doc.fontSize(10);
      doc.text(`Veículo (placa): ${vehicle.plate}`);
      doc.text(`Motorista: ${driver.name} (CNH ${driver.cnh})`);
      doc.text(`Número ONU: ${checklist.unNumber}`);
      doc.text(`Inspetor responsável: ${checklist.inspectorName}`);
      doc.text(`Data/hora: ${checklist.createdAt.toLocaleString('pt-BR')}`);
      doc.text(
        `Status geral: ${checklist.status === ChecklistStatus.COMPLIANT ? 'CONFORME' : 'NÃO CONFORME'}`,
      );
      doc.moveDown();

      for (const answer of checklist.answers) {
        const item = itemsById.get(answer.itemDefinitionId);
        if (!item) {
          continue;
        }

        doc
          .fontSize(10)
          .text(`${item.code} [${ANSWER_LABEL[answer.answer]}] ${item.description.replace(/\n+/g, ' ')}`);
        if (answer.note) {
          doc.fontSize(9).fillColor('gray').text(`Obs.: ${answer.note}`, { indent: 12 }).fillColor('black');
        }
        doc.moveDown(0.3);
      }

      doc.end();
    });
  }
}
