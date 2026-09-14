// * Provides database connectivity and transaction support for the application.
// * Used by modules and application bootstrap code through the platform public API.
// ! Keep business rules in module code; this layer supplies reusable technical capabilities.
import { Injectable } from '@nestjs/common';
import type { PoolClient } from 'pg';
import { PostgresDatabase } from '../postgres/postgres.database';
import type { TransactionManager } from './transaction-manager';

@Injectable()
export class PostgresTransactionManager implements TransactionManager {
  // * Receives the PostgreSQL adapter that owns transaction lifecycle and connection cleanup.
  constructor(private readonly database: PostgresDatabase) {}

  // * Delegates transaction execution to the shared PostgreSQL database adapter.
  run<T>(work: (client: PoolClient) => Promise<T>): Promise<T> {
    return this.database.transaction(work);
  }
}
