// * Linked with: pg.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import type { PoolClient, QueryResult, QueryResultRow } from 'pg';

// * Define the shared types or behavior used by the surrounding package.
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
