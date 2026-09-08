import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'node:crypto';
import { AppLogger } from '@platform/logging';
import { runWithRequestContext } from './request-context';

type Next = (error?: Error) => void;

function headerValue(value: string | string[] | undefined): string | undefined {
  const normalized = Array.isArray(value) ? value[0] : value;
  return normalized?.trim() || undefined;
}

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  public constructor(private readonly logger: AppLogger) {}

  public use(request: FastifyRequest, reply: FastifyReply, next: Next): void {
    const requestId = headerValue(request.headers['x-request-id']) ?? randomUUID();
    const correlationId = headerValue(request.headers['x-correlation-id']) ?? requestId;
    const apiVersion = `v${process.env.API_VERSION ?? '1'}`;

    reply.header('X-Request-ID', requestId);
    reply.header('X-Correlation-ID', correlationId);
    reply.header('X-API-Version', apiVersion);

    reply.raw.once('finish', () => {
      this.logger.log(
        `${request.method} ${request.url} ${reply.raw.statusCode} requestId=${requestId}`,
        RequestContextMiddleware.name,
      );
    });

    runWithRequestContext({ requestId, correlationId, apiVersion }, () => next());
  }
}
