// Linked with: @nestjs/common, @platform/database, @platform/database.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Injectable, Optional } from '@nestjs/common';
import type { SqlExecutor } from '@platform/database';
import { PostgresDatabase } from '@platform/database';
import { AppLogger } from '@platform/logging';
import { AppError, InfrastructureUnavailableError, OperationTimeoutError } from '@shared/errors';

// Define the shared types or behavior used by the surrounding package.
export interface ExecutionOptions {
  operation: string;
  layer?: string;
  context?: Readonly<Record<string, unknown>>;
  timeoutMs?: number;
  transactional?: boolean;
}

export type Operation<T> = (executor: SqlExecutor | undefined) => Promise<T>;

/** Owns operation logging, failure reporting, deadlines, and DB transactions. */
@Injectable()
export class ExecutionService {
  public constructor(
    @Optional() private readonly database: PostgresDatabase | null,
    private readonly logger: AppLogger,
  ) {}

  public async execute<T>(options: ExecutionOptions, operation: Operation<T>): Promise<T> {
    const operationName = requireText(options.operation, 'operation');
    const layer = requireText(options.layer ?? 'application', 'layer');
    const timeoutMs = validateTimeout(options.timeoutMs);
    const startedAt = performance.now();
    const metadata = { ...options.context, operation: operationName, layer };

    this.logger.debugEvent('Operation started', {
      ...metadata,
      timeout_ms: timeoutMs,
      transactional: options.transactional !== false,
    });

    try {
      if (options.transactional !== false && this.database === null) {
        throw new InfrastructureUnavailableError('PostgreSQL is not enabled.');
      }
      const work = () =>
        options.transactional === false
          ? operation(this.database ?? undefined)
          : this.database!.transaction((client) => operation(client));
      const result = timeoutMs === undefined ? await work() : await withTimeout(work(), timeoutMs);
      this.logger.debugEvent('Operation completed', {
        ...metadata,
        duration_ms: elapsedMilliseconds(startedAt),
      });
      return result;
    } catch (error) {
      if (error instanceof TimeoutMarker) {
        const timeoutError = new OperationTimeoutError(
          `Operation '${operationName}' exceeded its ${timeoutMs}ms deadline.`,
        );
        this.logger.warnEvent('Operation timed out', {
          ...metadata,
          duration_ms: elapsedMilliseconds(startedAt),
          timeout_ms: timeoutMs,
        });
        throw timeoutError;
      }

      if (error instanceof AppError) {
        this.logger.debugEvent('Operation rejected', {
          ...metadata,
          duration_ms: elapsedMilliseconds(startedAt),
          error_code: error.code,
          exception_type: error.name,
        });
      } else {
        this.logger.errorEvent(
          'Operation failed',
          {
            ...metadata,
            duration_ms: elapsedMilliseconds(startedAt),
            exception_type: error instanceof Error ? error.name : 'UnknownError',
          },
          error,
        );
      }
      throw error;
    }
  }
}

class TimeoutMarker extends Error {}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new TimeoutMarker()), timeoutMs);
    void promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error instanceof Error ? error : new Error(String(error)));
      },
    );
  });
}

function requireText(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} must be a non-empty string.`);
  return normalized;
}

function validateTimeout(timeoutMs: number | undefined): number | undefined {
  if (timeoutMs === undefined) return undefined;
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error('timeoutMs must be a positive finite number.');
  }
  return timeoutMs;
}

function elapsedMilliseconds(startedAt: number): number {
  return Math.round((performance.now() - startedAt) * 100) / 100;
}

export const executeServiceOperation = <T>(
  execution: ExecutionService,
  options: ExecutionOptions,
  operation: Operation<T>,
): Promise<T> =>
  execution.execute({ ...options, layer: options.layer ?? 'application' }, operation);
