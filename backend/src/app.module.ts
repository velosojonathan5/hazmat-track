import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validateEnv } from './config/env.validation.js';
import { buildTypeOrmOptions } from './config/typeorm.config.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ChecklistModule } from './modules/checklist/checklist.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { InspectionModule } from './modules/inspection/inspection.module.js';
import { StorageModule } from './shared/storage/storage.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: buildTypeOrmOptions,
    }),
    AuthModule,
    StorageModule,
    ChecklistModule,
    InspectionModule,
    HealthModule,
  ],
})
export class AppModule {}
