import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import type { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { POSTGRES_POOL } from './postgres.tokens';

@Injectable()
export class PostgresDatabase implements OnApplicationShutdown {
  constructor(@Inject(POSTGRES_POOL) private readonly pool: Pool) {}

  query<Row extends QueryResultRow = QueryResultRow>(
    text: string,
    values: readonly unknown[] = [],
  ): Promise<QueryResult<Row>> {
    return this.pool.query<Row>(text, values as unknown[]);
  }

  async transaction<T>(work: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
      const result = await work(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  onApplicationShutdown(): Promise<void> {
    return this.pool.end();
  }
}
