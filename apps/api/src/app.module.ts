import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PlatformConfigModule } from '@platform/config';
import { DatabaseModule } from '@platform/database';
import { HttpKernelModule } from '@platform/http';
import { LoggingModule } from '@platform/logging';
import { ObservabilityModule } from '@platform/observability';
import { CacheModule } from '@platform/cache';
import { HealthModule } from './health/health.module';
import { BaseModule } from './base/base.module';

@Module({
  imports: [
    PlatformConfigModule,
    LoggingModule,
    ObservabilityModule,
    DatabaseModule,
    CacheModule,
    HttpKernelModule,
    CqrsModule.forRoot(),
    HealthModule,
    BaseModule,
  ],
})
export class AppModule {}
