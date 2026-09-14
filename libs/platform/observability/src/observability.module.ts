// * Provides observability platform integration for the application.
// * Used by modules and application bootstrap code through the platform public API.
import { Module } from '@nestjs/common';

/** Platform-level observability primitives. Keep business rules out of this library. */
// TODO: Register tracing, metrics, and health instrumentation providers as observability requirements grow.
@Module({})
export class ObservabilityModule {}
