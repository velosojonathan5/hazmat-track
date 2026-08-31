import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetSystemHealthUseCase } from '../../application/use-cases/get-system-health.use-case.js';
import { HealthResponseDto } from './dto/health-response.dto.js';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly getSystemHealth: GetSystemHealthUseCase) {}

  @Get()
  @ApiOkResponse({ type: HealthResponseDto })
  async check(): Promise<HealthResponseDto> {
    return this.getSystemHealth.execute();
  }
}
