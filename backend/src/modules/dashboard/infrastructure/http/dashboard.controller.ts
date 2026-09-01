import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../../auth/domain/entities/user.entity.js';
import { Roles } from '../../../auth/infrastructure/http/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../../../auth/infrastructure/http/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../../auth/infrastructure/http/guards/roles.guard.js';
import { GetDashboardMetricsUseCase } from '../../application/use-cases/get-dashboard-metrics.use-case.js';
import { DashboardFiltersQueryDto } from './dto/dashboard-filters-query.dto.js';
import { DashboardMetricsResponseDto } from './dto/dashboard-metrics-response.dto.js';

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly getDashboardMetricsUseCase: GetDashboardMetricsUseCase) {}

  @Get('metrics')
  @Roles(UserRole.INSPECTOR, UserRole.MANAGER)
  @ApiOkResponse({ type: DashboardMetricsResponseDto })
  getMetrics(@Query() query: DashboardFiltersQueryDto): Promise<DashboardMetricsResponseDto> {
    return this.getDashboardMetricsUseCase.execute({
      vehiclePlate: query.vehiclePlate,
      unNumber: query.unNumber,
      from: query.from ? new Date(query.from) : undefined,
      to: query.to ? new Date(query.to) : undefined,
    });
  }
}
