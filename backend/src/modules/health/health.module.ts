import { Module } from '@nestjs/common';
import { DATABASE_PING_PORT } from './domain/ports/database-ping.port.js';
import { GetSystemHealthUseCase } from './application/use-cases/get-system-health.use-case.js';
import { TypeOrmDatabasePingAdapter } from './infrastructure/persistence/typeorm-database-ping.adapter.js';
import { HealthController } from './infrastructure/http/health.controller.js';

@Module({
  controllers: [HealthController],
  providers: [
    GetSystemHealthUseCase,
    { provide: DATABASE_PING_PORT, useClass: TypeOrmDatabasePingAdapter },
  ],
})
export class HealthModule {}
