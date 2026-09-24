// * Inventory module: Defines stable application errors for stock and warehouse workflows.
// * File: src/contracts/inventory.errors.ts
// ? Keep inventory error codes independent from Nest transport and PostgreSQL details.
// ! Do not expose raw database errors as the public inventory contract.
import { ConflictError, NotFoundError, ValidationError } from '@shared/errors';

/** Conflict raised when inventory cannot be changed safely in the current state. */
export class InventoryConflictError extends ConflictError {
  public constructor(
    public override readonly code: string,
    message: string,
    details?: unknown,
  ) {
    super(message, details);
  }
}

/** Not-found error raised when an inventory resource is unavailable. */
export class InventoryNotFoundError extends NotFoundError {
  public constructor(public override readonly code: string, message: string) {
    super(message);
  }
}

/** Validation error raised when inventory input violates a business rule. */
export class InventoryValidationError extends ValidationError {
  public override readonly code = 'INVENTORY_VALIDATION_ERROR';
}
