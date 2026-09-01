import { Module } from '@nestjs/common';
import { AuthModule } from '../../modules/auth/auth.module.js';
import { FILE_STORAGE_PORT } from './domain/file-storage.port.js';
import { UploadController } from './infrastructure/http/upload.controller.js';
import { S3FileStorageAdapter } from './infrastructure/s3-file-storage.adapter.js';

@Module({
  imports: [AuthModule],
  controllers: [UploadController],
  providers: [{ provide: FILE_STORAGE_PORT, useClass: S3FileStorageAdapter }],
  exports: [FILE_STORAGE_PORT],
})
export class StorageModule {}
