// * Linked with: @nestjs/common, pg, ../postgres/postgres.database.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Injectable } from '@nestjs/common';
import type { PoolClient } from 'pg';
import { PostgresDatabase } from '../postgres/postgres.database';
import type { TransactionManager } from './transaction-manager';

// * Define the shared types or behavior used by the surrounding package.
@Injectable()
export class PostgresTransactionManager implements TransactionManager {
  constructor(private readonly database: PostgresDatabase) {}

  run<T>(work: (client: PoolClient) => Promise<T>): Promise<T> {
    return this.database.transaction(work);
  }
}
