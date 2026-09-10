import { AsyncLocalStorage } from 'node:async_hooks';
import type { PoolClient } from 'pg';

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
