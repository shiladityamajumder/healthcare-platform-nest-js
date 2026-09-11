// * Linked with: node:async_hooks.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { AsyncLocalStorage } from 'node:async_hooks';

// * Define the shared types or behavior used by the surrounding package.
export interface RequestContext {
  requestId: string;
  correlationId: string;
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

export function getApiVersion(): string {
  return storage.getStore()?.apiVersion ?? `v${process.env.API_VERSION ?? '1'}`;
}
