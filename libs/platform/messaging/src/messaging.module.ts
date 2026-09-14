// * Provides messaging platform integration for the application.
// * Used by modules and application bootstrap code through the platform public API.
import { Module } from '@nestjs/common';

/** Platform-level messaging primitives. Keep business rules out of this library. */
// TODO: Register provider-neutral message buses and delivery adapters when messaging workflows are implemented.
@Module({})
export class MessagingModule {}
