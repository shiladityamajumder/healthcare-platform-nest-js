// Linked with: node:async_hooks, pg.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { AsyncLocalStorage } from 'node:async_hooks';
import type { PoolClient } from 'pg';

// Define the shared types or behavior used by the surrounding package.
const storage = new AsyncLocalStorage<PoolClient>();

/** Return the client owned by the current application transaction, if any. */
export function getTransactionClient(): PoolClient | undefined {
  return storage.getStore();
}

/** Run work with one transaction client available to all nested raw queries. */
export function runWithTransactionClient<T>(
  client: PoolClient,
  work: () => Promise<T>,
): Promise<T> {
  return storage.run(client, work);
}
