// * Provides HTTP request context and observability metadata for the application.
import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContext {
  requestId: string;
  correlationId: string;
  traceId?: string;
  taskId?: string;
  apiVersion: string;
}

const storage = new AsyncLocalStorage<RequestContext>();

export function runWithRequestContext<T>(context: RequestContext, callback: () => T): T {
  return storage.run(context, callback);
}

export function getRequestContext(): RequestContext | undefined {
  return storage.getStore();
}

export function getRequestId(): string | undefined {
  return storage.getStore()?.requestId;
}

export function getCorrelationId(): string | undefined {
  return storage.getStore()?.correlationId;
}

export function getTraceId(): string | undefined {
  return storage.getStore()?.traceId;
}

export function getTaskId(): string | undefined {
  return storage.getStore()?.taskId;
}

export function getApiVersion(): string {
  return storage.getStore()?.apiVersion ?? normalizeApiVersion(process.env.API_VERSION);
}

function normalizeApiVersion(value: string | undefined): string {
  const normalized = value?.trim().replace(/^\/+|\/+$/g, '') || '1';
  return normalized.startsWith('v') ? normalized : 'v' + normalized;
}
