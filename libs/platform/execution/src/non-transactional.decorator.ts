// Linked with: @nestjs/common.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { SetMetadata } from '@nestjs/common';

// Define the shared types or behavior used by the surrounding package.
export const NON_TRANSACTIONAL_METADATA = 'platform:non-transactional';

/** Mark endpoints such as liveness/readiness that must not touch PostgreSQL. */
export const NonTransactional = (): MethodDecorator & ClassDecorator =>
  SetMetadata(NON_TRANSACTIONAL_METADATA, true);
