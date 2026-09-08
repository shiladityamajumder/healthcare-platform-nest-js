import type { EntityManager } from 'typeorm';

export const TRANSACTION_MANAGER = Symbol('TRANSACTION_MANAGER');

export interface TransactionManager {
  run<T>(work: (manager: EntityManager) => Promise<T>): Promise<T>;
}
