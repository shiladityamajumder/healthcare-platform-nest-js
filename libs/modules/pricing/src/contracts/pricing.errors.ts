// * Pricing module: Defines stable application errors exposed by pricing workflows.
// * File: src/contracts/pricing.errors.ts
// ? Keep business error codes independent from transport and persistence implementations.
// ! Do not replace stable pricing error codes with database-specific messages.
import { ConflictError, NotFoundError, ValidationError } from '@shared/errors';

/** Conflict raised when pricing state cannot be created or updated safely. */
export class PricingConflictError extends ConflictError {
  // * Function [constructor]: Initializes a pricing conflict with a stable code and message.
  constructor(
    public override readonly code: string,
    message: string,
    details?: unknown,
  ) {
    super(message, details);
  }
}

/** Not-found error raised when a pricing resource is unavailable to the workflow. */
export class PricingNotFoundError extends NotFoundError {
  // * Function [constructor]: Initializes a pricing not-found error with a stable code.
  constructor(
    public override readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

/** Validation error raised when pricing input passes transport validation but fails business rules. */
export class PricingValidationError extends ValidationError {
  public override readonly code = 'BUSINESS_VALIDATION_ERROR';
}
