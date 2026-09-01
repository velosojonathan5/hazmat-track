import type { InspectionRepository } from '../../domain/inspection/inspection-repository.port';

export class DownloadInspectionPdfUseCase {
  private readonly inspectionRepository: InspectionRepository;

  constructor(inspectionRepository: InspectionRepository) {
    this.inspectionRepository = inspectionRepository;
  }

  execute(id: string): Promise<Blob> {
    return this.inspectionRepository.downloadPdf(id);
  }
}
