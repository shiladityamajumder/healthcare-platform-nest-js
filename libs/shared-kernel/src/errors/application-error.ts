// * Shared kernel: Defines framework-neutral application, domain, validation, authentication, and infrastructure errors.
// * File: src/errors/application-error.ts
// ? Keep this primitive stable, domain-neutral, and independent of platform or business modules.
// ! HTTP translation belongs in platform; preserve stable error codes for clients and observability.
/**
 * Framework-independent errors used by domain and application code.
 *
 * HTTP translation belongs to the platform HTTP layer. This keeps business
 * modules from depending on Nest or Fastify just to report an expected error.
 */
// * Type [AppError]: Provides a reusable framework-neutral shared-kernel primitive.
export class AppError extends Error {
  // * Function [constructor]: Initializes this primitive with its required state.
  public constructor(
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message.trim() || 'The operation could not be completed.');
    this.name = new.target.name;
  }
}

// * Type [DomainError]: Provides a reusable framework-neutral shared-kernel primitive.
export class DomainError extends AppError {
  // * Function [constructor]: Initializes this primitive with its required state.
  public constructor(message = 'A business rule was violated.', details?: unknown) {
    super('DOMAIN_ERROR', message, details);
  }
}

// * Type [ApplicationError]: Provides a reusable framework-neutral shared-kernel primitive.
export class ApplicationError extends AppError {
  // * Function [constructor]: Initializes this primitive with its required state.
  public constructor(message = 'The operation could not be completed.', details?: unknown) {
    super('APPLICATION_ERROR', message, details);
  }
}

// * Type [ValidationError]: Provides a reusable framework-neutral shared-kernel primitive.
export class ValidationError extends ApplicationError {
  // * Function [constructor]: Initializes this primitive with its required state.
  public constructor(message = 'The supplied input is invalid.', details?: unknown) {
    super(message, details);
  }

  public override readonly code: string = 'VALIDATION_ERROR';
}

// * Type [AuthenticationError]: Provides a reusable framework-neutral shared-kernel primitive.
export class AuthenticationError extends ApplicationError {
  public override readonly code: string = 'AUTHENTICATION_REQUIRED';
  // * Function [constructor]: Initializes this primitive with its required state.
  public constructor(message = 'Authentication is required.', details?: unknown) {
    super(message, details);
  }
}

// * Type [InvalidCredentialsError]: Provides a reusable framework-neutral shared-kernel primitive.
export class InvalidCredentialsError extends AuthenticationError {
  public override readonly code: string = 'AUTH_INVALID_CREDENTIALS';
  // * Function [constructor]: Initializes this primitive with its required state.
  public constructor(message = 'Invalid credentials.', details?: unknown) {
    super(message, details);
  }
}

// * Type [OtpInvalidError]: Provides a reusable framework-neutral shared-kernel primitive.
export class OtpInvalidError extends AuthenticationError {
  public override readonly code: string = 'AUTH_OTP_INVALID';
  // * Function [constructor]: Initializes this primitive with its required state.
  public constructor(message = 'The verification code is invalid.', details?: unknown) {
    super(message, details);
  }
}

// * Type [OtpExpiredError]: Provides a reusable framework-neutral shared-kernel primitive.
export class OtpExpiredError extends AuthenticationError {
  public override readonly code: string = 'AUTH_OTP_EXPIRED';
  // * Function [constructor]: Initializes this primitive with its required state.
  public constructor(message = 'The verification code has expired.', details?: unknown) {
    super(message, details);
  }
}

// * Type [OtpAttemptsExceededError]: Provides a reusable framework-neutral shared-kernel primitive.
export class OtpAttemptsExceededError extends AuthenticationError {
  public override readonly code: string = 'AUTH_OTP_ATTEMPTS_EXCEEDED';
  // * Function [constructor]: Initializes this primitive with its required state.
  public constructor(message = 'The verification challenge is blocked.', details?: unknown) {
    super(message, details);
  }
}

// * Type [OtpAlreadyUsedError]: Provides a reusable framework-neutral shared-kernel primitive.
export class OtpAlreadyUsedError extends AuthenticationError {
  public override readonly code: string = 'AUTH_OTP_ALREADY_USED';
  // * Function [constructor]: Initializes this primitive with its required state.
  public constructor(message = 'The verification code has already been used.', details?: unknown) {
    super(message, details);
  }
}

// * Type [SessionRevokedError]: Provides a reusable framework-neutral shared-kernel primitive.
export class SessionRevokedError extends AuthenticationError {
  public override readonly code: string = 'AUTH_SESSION_REVOKED';
  // * Function [constructor]: Initializes this primitive with its required state.
  public constructor(message = 'The session is expired or revoked.', details?: unknown) {
    super(message, details);
  }
}

// * Type [RefreshTokenReuseError]: Provides a reusable framework-neutral shared-kernel primitive.
export class RefreshTokenReuseError extends AuthenticationError {
  public override readonly code: string = 'AUTH_REFRESH_TOKEN_REUSE';
  // * Function [constructor]: Initializes this primitive with its required state.
  public constructor(message = 'Refresh token reuse was detected.', details?: unknown) {
    super(message, details);
  }
}

// * Type [AuthorizationError]: Provides a reusable framework-neutral shared-kernel primitive.
export class AuthorizationError extends ApplicationError {
  public override readonly code: string = 'PERMISSION_DENIED';
  // * Function [constructor]: Initializes this primitive with its required state.
  public constructor(
    message = 'You do not have permission to perform this operation.',
    details?: unknown,
  ) {
    super(message, details);
  }
}

// * Type [NotFoundError]: Provides a reusable framework-neutral shared-kernel primitive.
export class NotFoundError extends ApplicationError {
  public override readonly code: string = 'RESOURCE_NOT_FOUND';
  // * Function [constructor]: Initializes this primitive with its required state.
  public constructor(message = 'The requested resource was not found.', details?: unknown) {
    super(message, details);
  }
}

// * Type [ConflictError]: Provides a reusable framework-neutral shared-kernel primitive.
export class ConflictError extends ApplicationError {
  public override readonly code: string = 'RESOURCE_CONFLICT';
  // * Function [constructor]: Initializes this primitive with its required state.
  public constructor(
    message = 'The request conflicts with the current resource state.',
    details?: unknown,
  ) {
    super(message, details);
  }
}

// * Type [OperationTimeoutError]: Provides a reusable framework-neutral shared-kernel primitive.
export class OperationTimeoutError extends ApplicationError {
  public override readonly code: string = 'OPERATION_TIMEOUT';
  // * Function [constructor]: Initializes this primitive with its required state.
  public constructor(message = 'The operation timed out.', details?: unknown) {
    super(message, details);
  }
}

// * Type [ExternalServiceError]: Provides a reusable framework-neutral shared-kernel primitive.
export class ExternalServiceError extends ApplicationError {
  public override readonly code: string = 'EXTERNAL_SERVICE_ERROR';
  // * Function [constructor]: Initializes this primitive with its required state.
  public constructor(message = 'A required external service is unavailable.', details?: unknown) {
    super(message, details);
  }
}

// * Type [ExternalServiceTimeoutError]: Provides a reusable framework-neutral shared-kernel primitive.
export class ExternalServiceTimeoutError extends ExternalServiceError {
  public override readonly code: string = 'EXTERNAL_SERVICE_TIMEOUT';
  // * Function [constructor]: Initializes this primitive with its required state.
  public constructor(message = 'A required external service timed out.', details?: unknown) {
    super(message, details);
  }
}

// * Type [DatabaseError]: Provides a reusable framework-neutral shared-kernel primitive.
export class DatabaseError extends ApplicationError {
  public override readonly code: string = 'DATABASE_ERROR';
  // * Function [constructor]: Initializes this primitive with its required state.
  public constructor(message = 'A persistence operation failed.', details?: unknown) {
    super(message, details);
  }
}

// * Type [InfrastructureError]: Provides a reusable framework-neutral shared-kernel primitive.
export class InfrastructureError extends AppError {
  public override readonly code: string = 'INFRASTRUCTURE_ERROR';
  // * Function [constructor]: Initializes this primitive with its required state.
  public constructor(message = 'A required infrastructure component failed.', details?: unknown) {
    super('INFRASTRUCTURE_ERROR', message, details);
  }
}

// * Type [InfrastructureUnavailableError]: Provides a reusable framework-neutral shared-kernel primitive.
export class InfrastructureUnavailableError extends InfrastructureError {
  public override readonly code: string = 'INFRASTRUCTURE_UNAVAILABLE';
  // * Function [constructor]: Initializes this primitive with its required state.
  public constructor(
    message = 'A required service is temporarily unavailable.',
    details?: unknown,
  ) {
    super(message, details);
  }
}
