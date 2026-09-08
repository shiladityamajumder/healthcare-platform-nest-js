import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
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
import { ApiResponseFactory } from '../response/api-response';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<FastifyReply>();

    if (exception instanceof AppError) {
      response
        .status(statusFor(exception))
        .send(
          ApiResponseFactory.error(exception.code, exception.message, exception.details ?? null),
        );
      return;
    }

    if (exception instanceof HttpException) {
      response
        .status(exception.getStatus())
        .send(
          ApiResponseFactory.error(
            'HTTP_ERROR',
            messageForHttpException(exception),
            exception.getResponse(),
          ),
        );
      return;
    }

    this.logger.error(exception instanceof Error ? exception.stack : 'Unknown exception');
    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send(ApiResponseFactory.error('INTERNAL_SERVER_ERROR', 'An unexpected error occurred.'));
  }
}

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
