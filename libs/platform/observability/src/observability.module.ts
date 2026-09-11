// * Linked with: @nestjs/common.
// * Used by: the application module or feature root during NestJS startup.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';

/** Platform-level observability primitives. Keep business rules out of this library. */
// * Register the feature components and their dependencies with NestJS.
@Module({})
export class ObservabilityModule {}
