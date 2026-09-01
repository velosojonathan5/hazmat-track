import type { UploadedFile } from './uploaded-file';

export interface UploadRepository {
  upload(file: File): Promise<UploadedFile>;
}
