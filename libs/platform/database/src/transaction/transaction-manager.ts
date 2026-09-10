import type { PoolClient, QueryResult, QueryResultRow } from 'pg';

export const TRANSACTION_MANAGER = Symbol('TRANSACTION_MANAGER');

export interface SqlExecutor {
  query<Row extends QueryResultRow = QueryResultRow>(
    text: string,
    values?: readonly unknown[],
  ): Promise<QueryResult<Row>>;
}

export interface TransactionManager {
  run<T>(work: (client: PoolClient) => Promise<T>): Promise<T>;
}
