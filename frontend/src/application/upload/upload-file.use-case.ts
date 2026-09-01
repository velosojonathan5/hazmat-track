import type { UploadedFile } from '../../domain/upload/uploaded-file';
import type { UploadRepository } from '../../domain/upload/upload-repository.port';

export class UploadFileUseCase {
  private readonly uploadRepository: UploadRepository;

  constructor(uploadRepository: UploadRepository) {
    this.uploadRepository = uploadRepository;
  }

  execute(file: File): Promise<UploadedFile> {
    return this.uploadRepository.upload(file);
  }
}
