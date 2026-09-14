// * Provides HTTP request context, response formatting, and exception handling for the application.
// * Used by modules and application bootstrap code through the platform public API.
// ! Keep business rules in module code; this layer supplies reusable technical capabilities.
import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContext {
  requestId: string;
  correlationId: string;
  apiVersion: string;
}

const storage = new AsyncLocalStorage<RequestContext>();

// * Runs a callback with request metadata available through AsyncLocalStorage.
export function runWithRequestContext<T>(context: RequestContext, callback: () => T): T {
  return storage.run(context, callback);
}

// * Returns the complete request context for the current asynchronous execution chain.
export function getRequestContext(): RequestContext | undefined {
  return storage.getStore();
}

// * Returns the current request identifier used to correlate one HTTP request.
export function getRequestId(): string | undefined {
  return storage.getStore()?.requestId;
}

// * Returns the identifier used to correlate related requests across service boundaries.
export function getCorrelationId(): string | undefined {
  return storage.getStore()?.correlationId;
}

// * Returns the request API version and falls back to the configured default outside a request.
export function getApiVersion(): string {
  return storage.getStore()?.apiVersion ?? `v${process.env.API_VERSION ?? '1'}`;
}
