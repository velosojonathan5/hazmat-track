import { Inject, Injectable } from '@nestjs/common';
import {
  DATABASE_PING_PORT,
  type DatabasePingPort,
} from '../../domain/ports/database-ping.port.js';

export interface SystemHealth {
  status: 'ok' | 'degraded';
  database: boolean;
  timestamp: string;
}

@Injectable()
export class GetSystemHealthUseCase {
  constructor(
    @Inject(DATABASE_PING_PORT) private readonly databasePing: DatabasePingPort,
  ) {}

  async execute(): Promise<SystemHealth> {
    const database = await this.databasePing.ping();

    return {
      status: database ? 'ok' : 'degraded',
      database,
      timestamp: new Date().toISOString(),
    };
  }
}
