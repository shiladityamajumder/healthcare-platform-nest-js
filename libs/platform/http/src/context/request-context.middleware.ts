// * Binds request, correlation, and trace identifiers and emits structured HTTP completion logs.
import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { createHash, randomUUID } from 'node:crypto';
import type { ServerResponse } from 'node:http';
import { AppLogger } from '@platform/logging';
import { runWithRequestContext } from './request-context';

type Next = () => void;
type MiddlewareReply = FastifyReply | ServerResponse;

const IDENTIFIER_PATTERN = /^[A-Za-z0-9._:/-]{1,128}$/;
const TRACEPARENT_PATTERN = /^00-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/;

function headerValue(value: string | string[] | undefined): string | undefined {
  const normalized = Array.isArray(value) ? value[0] : value;
  return normalized?.trim() || undefined;
}

function acceptedIdentifier(value: string | undefined): string | undefined {
  return value && IDENTIFIER_PATTERN.test(value) ? value : undefined;
}

function traceIdFromHeader(value: string | undefined): string | undefined {
  const match = value?.toLowerCase().match(TRACEPARENT_PATTERN);
  if (!match || /^0+$/.test(match[1]) || /^0+$/.test(match[2])) return undefined;
  return match[1];
}

function hashClientIp(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return createHash('blake2b512').update(value).digest('hex').slice(0, 24);
}

function routeTemplate(request: FastifyRequest): string {
  return request.routeOptions?.url ?? request.url.split('?')[0] ?? 'unmatched';
}

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  public constructor(private readonly logger: AppLogger) {}

  public use(request: FastifyRequest, reply: MiddlewareReply, next: Next): void {
    const requestId =
      acceptedIdentifier(headerValue(request.headers['x-request-id'])) ?? randomUUID();
    const correlationId =
      acceptedIdentifier(headerValue(request.headers['x-correlation-id'])) ?? requestId;
    const traceId = traceIdFromHeader(headerValue(request.headers.traceparent));
    const apiVersion = normalizeApiVersion(process.env.API_VERSION);
    const startedAt = performance.now();
    const escapedException = false;

    setHeader(reply, 'X-Request-ID', requestId);
    setHeader(reply, 'X-Correlation-ID', correlationId);
    setHeader(reply, 'X-API-Version', apiVersion);

    rawResponse(reply).once('finish', () => {
      const durationMs = Math.round((performance.now() - startedAt) * 100) / 100;
      const statusCode = rawResponse(reply).statusCode || 500;
      const metadata = {
        http_method: request.method,
        http_route: routeTemplate(request),
        http_status_code: statusCode,
        duration_ms: durationMs,
        client_ip_hash: hashClientIp(request.socket.remoteAddress),
        exception_escaped: escapedException,
        request_id: requestId,
        correlation_id: correlationId,
        trace_id: traceId,
      };

      if (escapedException || statusCode >= 500) {
        this.logger.errorEvent('HTTP request failed', metadata);
      } else if (durationMs >= Number(process.env.SLOW_REQUEST_THRESHOLD_MS ?? 1000)) {
        this.logger.warnEvent('Slow HTTP request completed', metadata);
      } else {
        this.logger.infoEvent('HTTP request completed', metadata);
      }
    });

    runWithRequestContext({ requestId, correlationId, traceId, apiVersion }, () => next());
  }
}

function normalizeApiVersion(value: string | undefined): string {
  const normalized = value?.trim().replace(/^\/+|\/+$/g, '') || '1';
  return normalized.startsWith('v') ? normalized : 'v' + normalized;
}

function setHeader(reply: MiddlewareReply, name: string, value: string): void {
  if ('header' in reply && typeof reply.header === 'function') {
    reply.header(name, value);
    return;
  }
  (reply as ServerResponse).setHeader(name, value);
}

function rawResponse(reply: MiddlewareReply): ServerResponse {
  return 'raw' in reply ? reply.raw : reply;
}
