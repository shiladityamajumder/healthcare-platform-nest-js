// * Linked with: @nestjs/common, @nestjs/cqrs, @platform/config.
// * Used by: the application module or feature root during NestJS startup.
// * Other linkup: The file participates in the package export and dependency-injection flow.
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

// * Register the feature components and their dependencies with NestJS.
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
