// * Provides HTTP request context, response formatting, and exception handling for the application.
// * Used by modules and application bootstrap code through the platform public API.
// ! Keep business rules in module code; this layer supplies reusable technical capabilities.
import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';
import { AppLogger } from '@platform/logging';
import { runWithRequestContext } from './request-context';

type Next = (error?: Error) => void;
type MiddlewareReply = FastifyReply | ServerResponse;

// * Normalizes a possibly repeated HTTP header into one trimmed, non-empty value.
function headerValue(value: string | string[] | undefined): string | undefined {
  const normalized = Array.isArray(value) ? value[0] : value;
  return normalized?.trim() || undefined;
}

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  // * Receives the logger used to record completion details after each HTTP response finishes.
  public constructor(private readonly logger: AppLogger) {}

  // * Establishes request identifiers, response headers, completion logging, and async context.
  public use(request: FastifyRequest, reply: MiddlewareReply, next: Next): void {
    const requestId = headerValue(request.headers['x-request-id']) ?? randomUUID();
    const correlationId = headerValue(request.headers['x-correlation-id']) ?? requestId;
    const apiVersion = `v${process.env.API_VERSION ?? '1'}`;

    setHeader(reply, 'X-Request-ID', requestId);
    setHeader(reply, 'X-Correlation-ID', correlationId);
    setHeader(reply, 'X-API-Version', apiVersion);

    rawResponse(reply).once('finish', () => {
      this.logger.infoEvent('HTTP request completed', {
        method: request.method,
        url: request.url,
        status_code: rawResponse(reply).statusCode,
        request_id: requestId,
        correlation_id: correlationId,
      });
    });

    runWithRequestContext({ requestId, correlationId, apiVersion }, () => next());
  }
}

// * Writes a response header through Fastify when available, with a Node response fallback.
function setHeader(reply: MiddlewareReply, name: string, value: string): void {
  if ('header' in reply && typeof reply.header === 'function') {
    reply.header(name, value);
    return;
  }

  (reply as ServerResponse).setHeader(name, value);
}

// * Extracts the underlying Node response from either a Fastify reply or a native response.
function rawResponse(reply: MiddlewareReply): ServerResponse {
  return 'raw' in reply ? reply.raw : reply;
}
