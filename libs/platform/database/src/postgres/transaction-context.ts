// * Provides database connectivity and transaction support for the application.
// * Used by modules and application bootstrap code through the platform public API.
// ! Keep business rules in module code; this layer supplies reusable technical capabilities.
import { AsyncLocalStorage } from 'node:async_hooks';
import type { PoolClient } from 'pg';

const storage = new AsyncLocalStorage<PoolClient>();

/** Return the client owned by the current application transaction, if any. */
// * Returns the PostgreSQL client bound to the current asynchronous transaction context.
export function getTransactionClient(): PoolClient | undefined {
  return storage.getStore();
}

/** Run work with one transaction client available to all nested raw queries. */
// * Binds one PostgreSQL client to a callback so nested repositories share the same transaction.
export function runWithTransactionClient<T>(
  client: PoolClient,
  work: () => Promise<T>,
): Promise<T> {
  return storage.run(client, work);
}
