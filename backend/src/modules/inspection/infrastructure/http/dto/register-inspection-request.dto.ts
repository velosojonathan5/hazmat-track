import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import type { RingelmannGrade } from '../../../domain/entities/inspection.entity.js';
import { InspectionEvidenceRequestDto } from './inspection-evidence-request.dto.js';

export class RegisterInspectionRequestDto {
  @ApiProperty()
  @IsString()
  vehiclePlate!: string;

  @ApiProperty()
  @IsString()
  unNumber!: string;

  @ApiProperty()
  @IsLatitude()
  latitude!: number;

  @ApiProperty()
  @IsLongitude()
  longitude!: number;

  @ApiPropertyOptional({ enum: [0, 1, 2, 3, 4, 5] })
  @IsOptional()
  @IsIn([0, 1, 2, 3, 4, 5])
  ringelmannGrade?: RingelmannGrade;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiProperty({ type: [InspectionEvidenceRequestDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InspectionEvidenceRequestDto)
  evidences!: InspectionEvidenceRequestDto[];
}
