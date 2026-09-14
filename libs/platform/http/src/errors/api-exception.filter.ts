// * Provides HTTP request context, response formatting, and exception handling for the application.
// * Used by modules and application bootstrap code through the platform public API.
// ! Keep business rules in module code; this layer supplies reusable technical capabilities.
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import {
  AppError,
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  DatabaseError,
  ExternalServiceError,
  InfrastructureError,
  NotFoundError,
  OperationTimeoutError,
  ValidationError,
} from '@shared/errors';
import { AppLogger } from '@platform/logging';
import { ApiResponseFactory } from '../response/api-response';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  // * Receives the logger used for unexpected exceptions that have no application-level mapping.
  public constructor(private readonly logger: AppLogger) {}

  // * Translates application and framework exceptions into the standard HTTP error envelope.
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<FastifyReply>();

    if (exception instanceof AppError) {
      sendError(
        response,
        statusFor(exception),
        ApiResponseFactory.error(exception.code, exception.message, exception.details ?? null),
      );
      return;
    }

    if (exception instanceof HttpException) {
      sendError(
        response,
        exception.getStatus(),
        ApiResponseFactory.error(
          'HTTP_ERROR',
          messageForHttpException(exception),
          exception.getResponse(),
        ),
      );
      return;
    }

    this.logger.errorEvent('Unhandled application exception', {}, exception);
    sendError(
      response,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ApiResponseFactory.error('INTERNAL_SERVER_ERROR', 'An unexpected error occurred.'),
    );
  }
}

// * Sends a prepared error envelope with the selected HTTP status code.
function sendError(response: FastifyReply, status: HttpStatus, body: unknown): void {
  response.code(status).send(body);
}

// * Maps known application error types to their corresponding HTTP status codes.
function statusFor(exception: AppError): HttpStatus {
  if (exception instanceof ValidationError) return HttpStatus.BAD_REQUEST;
  if (exception instanceof AuthenticationError) return HttpStatus.UNAUTHORIZED;
  if (exception instanceof AuthorizationError) return HttpStatus.FORBIDDEN;
  if (exception instanceof NotFoundError) return HttpStatus.NOT_FOUND;
  if (exception instanceof ConflictError) return HttpStatus.CONFLICT;
  if (exception instanceof OperationTimeoutError) return HttpStatus.REQUEST_TIMEOUT;
  if (exception instanceof ExternalServiceError || exception instanceof DatabaseError) {
    return HttpStatus.SERVICE_UNAVAILABLE;
  }
  if (exception instanceof InfrastructureError) return HttpStatus.SERVICE_UNAVAILABLE;
  return HttpStatus.BAD_REQUEST;
}

// * Extracts a safe human-readable message from a NestJS HTTP exception response.
function messageForHttpException(exception: HttpException): string {
  const body = exception.getResponse();
  if (typeof body === 'string') return body;
  if (typeof body === 'object' && body !== null && 'message' in body) {
    const message = body.message;
    if (Array.isArray(message)) return 'The supplied input is invalid.';
    if (typeof message === 'string') return message;
  }
  return exception.message;
}
