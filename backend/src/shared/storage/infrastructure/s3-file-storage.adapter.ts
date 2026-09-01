import { randomUUID } from 'node:crypto';
import {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FileStoragePort, UploadedFile } from '../domain/file-storage.port.js';

@Injectable()
export class S3FileStorageAdapter implements FileStoragePort, OnModuleInit {
  private readonly logger = new Logger(S3FileStorageAdapter.name);
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicEndpoint: string;

  constructor(private readonly config: ConfigService) {
    this.bucket = this.config.get<string>('STORAGE_BUCKET')!;
    // Bucket-rooted: the base URL already resolves to the bucket (e.g. an R2 custom
    // domain or public dev URL), so keys are appended directly with no bucket segment.
    this.publicEndpoint = this.config.get<string>('STORAGE_PUBLIC_ENDPOINT')!;
    this.client = new S3Client({
      endpoint: this.config.get<string>('STORAGE_INTERNAL_ENDPOINT'),
      region: 'us-east-1',
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.config.get<string>('STORAGE_ACCESS_KEY')!,
        secretAccessKey: this.config.get<string>('STORAGE_SECRET_KEY')!,
      },
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch {
      await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));
      await this.client.send(
        new PutBucketPolicyCommand({
          Bucket: this.bucket,
          Policy: JSON.stringify({
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: { AWS: ['*'] },
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${this.bucket}/*`],
              },
            ],
          }),
        }),
      );
      this.logger.log(`Created storage bucket "${this.bucket}" with public read access`);
    }
  }

  async upload(buffer: Buffer, filename: string, contentType: string): Promise<UploadedFile> {
    const key = `${randomUUID()}-${filename}`;
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    );

    return { key, url: `${this.publicEndpoint}/${key}` };
  }

  async download(key: string): Promise<Buffer> {
    const response = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }));
    const bytes = await response.Body!.transformToByteArray();
    return Buffer.from(bytes);
  }
}
