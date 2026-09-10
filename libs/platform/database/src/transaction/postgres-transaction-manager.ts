import { Injectable } from '@nestjs/common';
import type { PoolClient } from 'pg';
import type { PostgresDatabase } from '../postgres/postgres.database';
import type { TransactionManager } from './transaction-manager';

@Injectable()
export class PostgresTransactionManager implements TransactionManager {
  constructor(private readonly database: PostgresDatabase) {}

  run<T>(work: (client: PoolClient) => Promise<T>): Promise<T> {
    return this.database.transaction(work);
  }
}
