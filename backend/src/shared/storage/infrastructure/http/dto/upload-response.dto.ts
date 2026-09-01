import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty()
  url!: string;

  @ApiProperty()
  key!: string;
}
