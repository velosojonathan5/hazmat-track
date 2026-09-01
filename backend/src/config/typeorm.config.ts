import type { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function buildTypeOrmOptions(config: ConfigService): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: config.get<string>('DB_HOST'),
    port: config.get<number>('DB_PORT'),
    username: config.get<string>('DB_USER'),
    password: config.get<string>('DB_PASSWORD'),
    database: config.get<string>('DB_NAME'),
    ssl: config.get<boolean>('DB_SSL') ? { rejectUnauthorized: false } : false,
    autoLoadEntities: true,
    // No migrations in this codebase yet, so synchronize stays on in every
    // environment, including production, to create the schema. Switch to
    // real migrations before this holds production data.
    synchronize: true,
  };
}
