import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class DashboardFiltersQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vehiclePlate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  unNumber?: string;

  @ApiPropertyOptional({ description: 'ISO 8601 date-time, inclusive lower bound' })
  @IsOptional()
  @IsISO8601()
  from?: string;

  @ApiPropertyOptional({ description: 'ISO 8601 date-time, inclusive upper bound' })
  @IsOptional()
  @IsISO8601()
  to?: string;
}
