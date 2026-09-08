/**
 * Framework-independent errors used by domain and application code.
 *
 * HTTP translation belongs to the platform HTTP layer. This keeps business
 * modules from depending on Nest or Fastify just to report an expected error.
 */
export class AppError extends Error {
  public constructor(
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message.trim() || 'The operation could not be completed.');
    this.name = new.target.name;
  }
}

export class DomainError extends AppError {
  public constructor(message = 'A business rule was violated.', details?: unknown) {
    super('DOMAIN_ERROR', message, details);
  }
}

export class ApplicationError extends AppError {
  public constructor(message = 'The operation could not be completed.', details?: unknown) {
    super('APPLICATION_ERROR', message, details);
  }
}

export class ValidationError extends ApplicationError {
  public constructor(message = 'The supplied input is invalid.', details?: unknown) {
    super(message, details);
  }

  public override readonly code: string = 'VALIDATION_ERROR';
}

export class AuthenticationError extends ApplicationError {
  public override readonly code: string = 'AUTHENTICATION_REQUIRED';
  public constructor(message = 'Authentication is required.', details?: unknown) {
    super(message, details);
  }
}

export class AuthorizationError extends ApplicationError {
  public override readonly code: string = 'PERMISSION_DENIED';
  public constructor(
    message = 'You do not have permission to perform this operation.',
    details?: unknown,
  ) {
    super(message, details);
  }
}

export class NotFoundError extends ApplicationError {
  public override readonly code: string = 'RESOURCE_NOT_FOUND';
  public constructor(message = 'The requested resource was not found.', details?: unknown) {
    super(message, details);
  }
}

export class ConflictError extends ApplicationError {
  public override readonly code: string = 'RESOURCE_CONFLICT';
  public constructor(
    message = 'The request conflicts with the current resource state.',
    details?: unknown,
  ) {
    super(message, details);
  }
}

export class OperationTimeoutError extends ApplicationError {
  public override readonly code: string = 'OPERATION_TIMEOUT';
  public constructor(message = 'The operation timed out.', details?: unknown) {
    super(message, details);
  }
}

export class ExternalServiceError extends ApplicationError {
  public override readonly code: string = 'EXTERNAL_SERVICE_ERROR';
  public constructor(message = 'A required external service is unavailable.', details?: unknown) {
    super(message, details);
  }
}

export class ExternalServiceTimeoutError extends ExternalServiceError {
  public override readonly code: string = 'EXTERNAL_SERVICE_TIMEOUT';
  public constructor(message = 'A required external service timed out.', details?: unknown) {
    super(message, details);
  }
}

export class DatabaseError extends ApplicationError {
  public override readonly code: string = 'DATABASE_ERROR';
  public constructor(message = 'A persistence operation failed.', details?: unknown) {
    super(message, details);
  }
}

export class InfrastructureError extends AppError {
  public override readonly code: string = 'INFRASTRUCTURE_ERROR';
  public constructor(message = 'A required infrastructure component failed.', details?: unknown) {
    super('INFRASTRUCTURE_ERROR', message, details);
  }
}

export class InfrastructureUnavailableError extends InfrastructureError {
  public override readonly code: string = 'INFRASTRUCTURE_UNAVAILABLE';
  public constructor(
    message = 'A required service is temporarily unavailable.',
    details?: unknown,
  ) {
    super(message, details);
  }
}
