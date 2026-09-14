// * Provides operation execution, logging, timeout, and transaction boundaries for the application.
// * Used by modules and application bootstrap code through the platform public API.
// ! Keep business rules in module code; this layer supplies reusable technical capabilities.
import { SetMetadata } from '@nestjs/common';

export const NON_TRANSACTIONAL_METADATA = 'platform:non-transactional';

/** Mark endpoints such as liveness/readiness that must not touch PostgreSQL. */
// * Marks a controller or handler so the execution interceptor skips the database transaction.
// ? Use this only for operations that are safe and useful when PostgreSQL is unavailable.
export const NonTransactional = (): MethodDecorator & ClassDecorator =>
  SetMetadata(NON_TRANSACTIONAL_METADATA, true);
