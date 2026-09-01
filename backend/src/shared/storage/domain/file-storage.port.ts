export const FILE_STORAGE_PORT = Symbol('FILE_STORAGE_PORT');

export interface UploadedFile {
  key: string;
  url: string;
}

export interface FileStoragePort {
  upload(buffer: Buffer, filename: string, contentType: string): Promise<UploadedFile>;
  download(key: string): Promise<Buffer>;
}
