// * Provides database connectivity and transaction support for the application.
// * Used by modules and application bootstrap code through the platform public API.
// ! Keep business rules in module code; this layer supplies reusable technical capabilities.
import { Inject, Injectable, OnApplicationShutdown, Optional } from '@nestjs/common';
import type { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { AppLogger } from '@platform/logging';
import { POSTGRES_POOL } from './postgres.tokens';
import { getTransactionClient, runWithTransactionClient } from './transaction-context';

@Injectable()
export class PostgresDatabase implements OnApplicationShutdown {
  // * Receives the shared pool and optional logger used by query and transaction operations.
  constructor(
    @Inject(POSTGRES_POOL) private readonly pool: Pool,
    @Optional() private readonly logger?: AppLogger,
  ) {}

  // * Executes a parameterized query using the active transaction client when one exists.
  // ! Callers must pass values separately; never interpolate user input into SQL text.
  query<Row extends QueryResultRow = QueryResultRow>(
    text: string,
    values: readonly unknown[] = [],
  ): Promise<QueryResult<Row>> {
    const executor = getTransactionClient() ?? this.pool;
    return executor.query<Row>(text, values as unknown[]);
  }

  // * Runs work inside one PostgreSQL transaction, reusing an outer transaction when present.
  // ! Any failure triggers rollback before the original error is rethrown.
  async transaction<T>(work: (client: PoolClient) => Promise<T>): Promise<T> {
    const activeClient = getTransactionClient();
    if (activeClient) return work(activeClient);

    const client = await this.pool.connect();
    return runWithTransactionClient(client, async () => {
      try {
        await client.query('BEGIN');
        const result = await work(client);
        await client.query('COMMIT');
        return result;
      } catch (error) {
        try {
          await client.query('ROLLBACK');
        } catch (rollbackError) {
          this.logger?.errorEvent(
            'Database transaction rollback failed',
            { exception_type: error instanceof Error ? error.name : 'UnknownError' },
            rollbackError,
          );
        }
        throw error;
      } finally {
        client.release();
      }
    });
  }

  // * Drains and closes the PostgreSQL pool during application shutdown.
  onApplicationShutdown(): Promise<void> {
    return this.pool.end();
  }
}
