import type { UploadedFile } from '../../domain/upload/uploaded-file';
import type { UploadRepository } from '../../domain/upload/upload-repository.port';
import { apiUploadFile } from '../http/api-client';

export class HttpUploadRepository implements UploadRepository {
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  upload(file: File): Promise<UploadedFile> {
    return apiUploadFile<UploadedFile>('/uploads', file, { token: this.token });
  }
}
