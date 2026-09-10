import { SetMetadata } from '@nestjs/common';

export const NON_TRANSACTIONAL_METADATA = 'platform:non-transactional';

/** Mark endpoints such as liveness/readiness that must not touch PostgreSQL. */
export const NonTransactional = (): MethodDecorator & ClassDecorator =>
  SetMetadata(NON_TRANSACTIONAL_METADATA, true);
