import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { InspectionEvidenceType } from '../../../domain/entities/inspection-evidence.entity.js';

export class InspectionEvidenceRequestDto {
  @ApiProperty({ enum: InspectionEvidenceType })
  @IsEnum(InspectionEvidenceType)
  type!: InspectionEvidenceType;

  @ApiProperty()
  @IsString()
  url!: string;

  @ApiProperty()
  @IsString()
  storageKey!: string;
}
