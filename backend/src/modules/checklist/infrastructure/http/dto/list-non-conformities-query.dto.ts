import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { NonConformityStatus } from '../../../domain/entities/non-conformity.entity.js';

export class ListNonConformitiesQueryDto {
  @ApiPropertyOptional({ enum: NonConformityStatus })
  @IsOptional()
  @IsEnum(NonConformityStatus)
  status?: NonConformityStatus;
}
