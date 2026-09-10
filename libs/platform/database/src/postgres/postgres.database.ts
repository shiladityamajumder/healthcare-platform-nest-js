// Linked with: @nestjs/common, pg, @platform/logging.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Inject, Injectable, OnApplicationShutdown, Optional } from '@nestjs/common';
import type { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { AppLogger } from '@platform/logging';
import { POSTGRES_POOL } from './postgres.tokens';
import { getTransactionClient, runWithTransactionClient } from './transaction-context';

// Define the shared types or behavior used by the surrounding package.
@Injectable()
export class PostgresDatabase implements OnApplicationShutdown {
  constructor(
    @Inject(POSTGRES_POOL) private readonly pool: Pool,
    @Optional() private readonly logger?: AppLogger,
  ) {}

  query<Row extends QueryResultRow = QueryResultRow>(
    text: string,
    values: readonly unknown[] = [],
  ): Promise<QueryResult<Row>> {
    const executor = getTransactionClient() ?? this.pool;
    return executor.query<Row>(text, values as unknown[]);
  }

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

  onApplicationShutdown(): Promise<void> {
    return this.pool.end();
  }
}
