import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { ChecklistModule } from '../checklist/checklist.module.js';
import { InspectionModule } from '../inspection/inspection.module.js';
import { GetDashboardMetricsUseCase } from './application/use-cases/get-dashboard-metrics.use-case.js';
import { DashboardController } from './infrastructure/http/dashboard.controller.js';

@Module({
  imports: [AuthModule, ChecklistModule, InspectionModule],
  controllers: [DashboardController],
  providers: [GetDashboardMetricsUseCase],
})
export class DashboardModule {}
