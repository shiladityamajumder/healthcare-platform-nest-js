// * Provides operation execution, logging, timeout, and transaction boundaries for the application.
// * Used by modules and application bootstrap code through the platform public API.
// ! Keep business rules in module code; this layer supplies reusable technical capabilities.
import { Injectable, Optional } from '@nestjs/common';
import type { SqlExecutor } from '@platform/database';
import { PostgresDatabase } from '@platform/database';
import { AppLogger } from '@platform/logging';
import { AppError, InfrastructureUnavailableError, OperationTimeoutError } from '@shared/errors';

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
  // * Receives the optional database adapter and logger used by the execution boundary.
  public constructor(
    @Optional() private readonly database: PostgresDatabase | null,
    private readonly logger: AppLogger,
  ) {}

  // * Executes one application operation with logging, timeout handling, and an optional transaction.
  // ! Errors are logged and rethrown so the HTTP or worker boundary can produce the final response.
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

// * Rejects when an operation exceeds its deadline while clearing the timer on success or failure.
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

// * Trims and validates required operation metadata before it is written to logs.
function requireText(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} must be a non-empty string.`);
  return normalized;
}

// * Validates an optional timeout and preserves undefined when no deadline was requested.
function validateTimeout(timeoutMs: number | undefined): number | undefined {
  if (timeoutMs === undefined) return undefined;
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error('timeoutMs must be a positive finite number.');
  }
  return timeoutMs;
}

// * Converts the high-resolution elapsed time into a compact millisecond value for event metadata.
function elapsedMilliseconds(startedAt: number): number {
  return Math.round((performance.now() - startedAt) * 100) / 100;
}

// * Provides a functional wrapper for callers that prefer not to inject and call the service directly.
export const executeServiceOperation = <T>(
  execution: ExecutionService,
  options: ExecutionOptions,
  operation: Operation<T>,
): Promise<T> =>
  execution.execute({ ...options, layer: options.layer ?? 'application' }, operation);
