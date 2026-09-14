// * Provides security platform integration for the application.
// * Used by modules and application bootstrap code through the platform public API.
import { Module } from '@nestjs/common';

/** Platform-level security primitives. Keep business rules out of this library. */
// TODO: Register shared guards, cryptographic providers, and security policies here as they are introduced.
@Module({})
export class SecurityModule {}
