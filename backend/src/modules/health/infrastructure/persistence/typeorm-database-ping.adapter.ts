import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { DatabasePingPort } from '../../domain/ports/database-ping.port.js';

@Injectable()
export class TypeOrmDatabasePingAdapter implements DatabasePingPort {
  private readonly logger = new Logger(TypeOrmDatabasePingAdapter.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async ping(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      return true;
    } catch (error) {
      this.logger.error('Falha ao verificar conexão com o banco de dados', error);
      return false;
    }
  }
}
