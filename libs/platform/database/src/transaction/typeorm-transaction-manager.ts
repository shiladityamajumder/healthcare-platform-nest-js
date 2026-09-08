import type { DataSource, EntityManager } from 'typeorm';
import type { TransactionManager } from './transaction-manager';

export class TypeOrmTransactionManager implements TransactionManager {
  constructor(private readonly dataSource: DataSource) {}

  run<T>(work: (manager: EntityManager) => Promise<T>): Promise<T> {
    return this.dataSource.transaction(work);
  }
}
