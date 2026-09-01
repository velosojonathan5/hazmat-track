import {
  BadRequestException,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { Express } from 'express';
import { JwtAuthGuard } from '../../../../modules/auth/infrastructure/http/guards/jwt-auth.guard.js';
import { FILE_STORAGE_PORT, type FileStoragePort } from '../../domain/file-storage.port.js';
import { UploadResponseDto } from './dto/upload-response.dto.js';

@ApiTags('uploads')
@ApiBearerAuth()
@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(@Inject(FILE_STORAGE_PORT) private readonly fileStorage: FileStoragePort) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: UploadResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('No file was sent');
    }

    const { url, key } = await this.fileStorage.upload(file.buffer, file.originalname, file.mimetype);
    return { url, key };
  }
}
