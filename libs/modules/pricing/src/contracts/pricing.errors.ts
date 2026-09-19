import { ConflictError, NotFoundError, ValidationError } from '@shared/errors';

export class PricingConflictError extends ConflictError {
  constructor(
    public override readonly code: string,
    message: string,
    details?: unknown,
  ) {
    super(message, details);
  }
}

export class PricingNotFoundError extends NotFoundError {
  constructor(
    public override readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export class PricingValidationError extends ValidationError {
  public override readonly code = 'BUSINESS_VALIDATION_ERROR';
}
