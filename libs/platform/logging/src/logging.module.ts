// * Provides context-aware structured application logging for the application.
import { Global, Injectable, Logger, Module } from '@nestjs/common';
import { threadId } from 'node:worker_threads';
import { getRequestContext } from '../../http/src/context/request-context';

export type LogMetadata = Readonly<Record<string, unknown>>;
type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'verbose';

export interface OperationLogOptions {
  operation: string;
  layer: string;
  context?: LogMetadata;
  timeoutMs?: number;
  transactional?: boolean;
}

export interface OperationLogScope {
  completed(metadata?: LogMetadata): void;
  rejected(metadata?: LogMetadata): void;
  timedOut(metadata?: LogMetadata): void;
  failed(metadata: LogMetadata | undefined, error: unknown): void;
}

const PRIORITY: Record<LogLevel, number> = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  verbose: 5,
};
const SENSITIVE = new Set([
  'accesskey',
  'accesstoken',
  'apikey',
  'authorization',
  'bearertoken',
  'clientsecret',
  'connectionstring',
  'cookie',
  'credentials',
  'databasepassword',
  'databaseurl',
  'dsn',
  'emailpassword',
  'idtoken',
  'jwt',
  'password',
  'passwd',
  'privatekey',
  'proxyauthorization',
  'refreshtoken',
  'secret',
  'secretkey',
  'sessioncookie',
  'sessiontoken',
  'setcookie',
  'smtppassword',
  'token',
]);
const RESERVED = new Set([
  'timestamp',
  'level',
  'logger',
  'message',
  'request_id',
  'correlation_id',
  'trace_id',
  'task_id',
  'process_id',
  'process_name',
  'thread_id',
  'thread_name',
  'module',
  'function',
  'line',
  'exception',
  'stack',
]);
const AUTH = /\b(?:authorization|proxy-authorization|bearer)\b\s*[:=]?\s*[^\s,;]+/gi;
const URI_PASSWORD = /(:\/\/[^:/\s]+:)([^@/\s]+)(@)/g;
const SECRET_ASSIGNMENT =
  /\b(password|passwd|pwd|secret|secret[_-]?key|api[_-]?key|access[_-]?token|refresh[_-]?token|id[_-]?token|client[_-]?secret|private[_-]?key|session[_-]?token)\b(["']?\s*[:=]\s*["']?)([^\s,;"'}]+)/gi;

const levelFromEnvironment = (): LogLevel => {
  const value = (process.env.LOG_LEVEL ?? 'info').trim().toLowerCase();
  if (value === 'log') return 'info';
  if (value === 'trace') return 'verbose';
  return value in PRIORITY ? (value as LogLevel) : 'info';
};

const enabled = (level: LogLevel, configured: LogLevel): boolean =>
  PRIORITY[level] <= PRIORITY[configured];

const normalizeKey = (key: string): string => key.toLowerCase().replace(/[^a-z0-9]/g, '');

const redactionEnabled = (): boolean => {
  const value = process.env.SENSITIVE_DATA_REDACTION_ENABLED?.trim().toLowerCase();
  return value === undefined || value === 'true' || value === '1';
};

const redactText = (value: string): string => {
  if (!redactionEnabled()) return value;
  return value
    .replace(AUTH, 'authorization=[REDACTED]')
    .replace(URI_PASSWORD, '$1[REDACTED]$3')
    .replace(SECRET_ASSIGNMENT, '$1=[REDACTED]');
};

/** Recursively converts metadata into safe JSON-compatible values. */
export function sanitizeLogValue(
  value: unknown,
  key?: string,
  seen = new Set<object>(),
  depth = 0,
): unknown {
  if (redactionEnabled() && key && SENSITIVE.has(normalizeKey(key))) return '[REDACTED]';
  if (value === null || typeof value === 'boolean' || typeof value === 'number') return value;
  if (typeof value === 'string') return redactText(value);
  if (typeof value === 'bigint') return value.toString();
  if (typeof value === 'undefined') return '<undefined>';
  if (typeof value === 'symbol') return value.toString();
  if (typeof value === 'function') return '[function]';
  if (Buffer.isBuffer(value)) return '<bytes:' + value.length + '>';
  if (value instanceof Date) return value.toISOString();
  if (value instanceof Error) {
    return {
      type: value.name,
      message: redactText(value.message),
      ...(value.stack ? { stack: redactText(value.stack) } : {}),
    };
  }
  if (depth >= 8) return '<maximum-depth-reached>';
  if (typeof value !== 'object') return '<unserializable>';
  if (seen.has(value)) return '<circular-reference>';
  seen.add(value);
  try {
    if (value instanceof Map) {
      return Object.fromEntries(
        [...value.entries()].map(([entryKey, entryValue]) => [
          String(entryKey),
          sanitizeLogValue(entryValue, String(entryKey), seen, depth + 1),
        ]),
      );
    }
    if (value instanceof Set) {
      return [...value].map((item) => sanitizeLogValue(item, undefined, seen, depth + 1));
    }
    if (Array.isArray(value)) {
      return value.map((item) => sanitizeLogValue(item, undefined, seen, depth + 1));
    }
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entryValue]) => [
        entryKey,
        sanitizeLogValue(entryValue, entryKey, seen, depth + 1),
      ]),
    );
  } catch {
    return '<unserializable>';
  } finally {
    seen.delete(value);
  }
}

/** Application logger with the same stable envelope as the Python service. */
@Injectable()
export class AppLogger extends Logger {
  private readonly configuredLevel = levelFromEnvironment();
  private readonly jsonMode =
    (process.env.LOG_JSON ?? '').toLowerCase() === 'true' ||
    (process.env.LOG_JSON ?? '') === '1' ||
    (process.env.NODE_ENV ?? 'development') === 'production';

  public constructor() {
    super('AppLogger');
  }

  public override log(message: unknown, context?: string): void {
    this.write('info', message, {}, undefined, context);
  }

  public override error(message: unknown, stackOrContext?: string, context?: string): void {
    const stack =
      context === undefined && stackOrContext?.includes('\n') ? stackOrContext : undefined;
    this.write('error', message, {}, stack, context ?? (stack ? undefined : stackOrContext));
  }

  public override warn(message: unknown, context?: string): void {
    this.write('warn', message, {}, undefined, context);
  }

  public override debug(message: unknown, context?: string): void {
    this.write('debug', message, {}, undefined, context);
  }

  public override verbose(message: unknown, context?: string): void {
    this.write('verbose', message, {}, undefined, context);
  }

  public override fatal(message: unknown, context?: string): void {
    this.write('fatal', message, {}, undefined, context);
  }

  public debugEvent(message: string, metadata: LogMetadata = {}): void {
    this.write('debug', message, metadata);
  }

  public infoEvent(message: string, metadata: LogMetadata = {}): void {
    this.write('info', message, metadata);
  }

  public warnEvent(message: string, metadata: LogMetadata = {}): void {
    this.write('warn', message, metadata);
  }

  public errorEvent(message: string, metadata: LogMetadata = {}, error?: unknown): void {
    this.write('error', message, metadata, error);
  }

  /**
   * Creates the lifecycle logger for one operation.
   *
   * Callers only need to create a scope once; the scope owns the standard
   * operation event names and keeps their metadata consistent.
   */
  public operation(options: OperationLogOptions): OperationLogScope {
    const metadata = {
      ...options.context,
      operation: options.operation,
      layer: options.layer,
    };

    this.debugEvent('Operation started', {
      ...metadata,
      timeout_ms: options.timeoutMs,
      transactional: options.transactional !== false,
    });

    return {
      completed: (eventMetadata = {}) =>
        this.debugEvent('Operation completed', { ...metadata, ...eventMetadata }),
      rejected: (eventMetadata = {}) =>
        this.debugEvent('Operation rejected', { ...metadata, ...eventMetadata }),
      timedOut: (eventMetadata = {}) =>
        this.warnEvent('Operation timed out', { ...metadata, ...eventMetadata }),
      failed: (eventMetadata = {}, error) =>
        this.errorEvent('Operation failed', { ...metadata, ...eventMetadata }, error),
    };
  }

  public flush(): void {
    process.stdout.write('');
  }

  private write(
    level: LogLevel,
    message: unknown,
    metadata: LogMetadata,
    error?: unknown,
    context?: string,
  ): void {
    if (!enabled(level, this.configuredLevel)) return;
    const requestContext = getRequestContext();
    const payload: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      logger: context ?? 'AppLogger',
      message: redactText(
        typeof message === 'string'
          ? message
          : (JSON.stringify(sanitizeLogValue(message)) ?? '<undefined>'),
      ),
      request_id: metadata.request_id ?? requestContext?.requestId ?? null,
      correlation_id: metadata.correlation_id ?? requestContext?.correlationId ?? null,
      trace_id: metadata.trace_id ?? requestContext?.traceId ?? null,
      task_id: metadata.task_id ?? requestContext?.taskId ?? null,
      process_id: process.pid,
      process_name: process.title,
      thread_id: threadId,
      thread_name: 'worker-' + threadId,
      module: 'healthcare-platform-nest-js',
      function: context ?? 'AppLogger',
      line: 0,
    };
    for (const [key, value] of Object.entries(metadata)) {
      if (!RESERVED.has(key)) payload[key] = sanitizeLogValue(value, key);
    }
    if (error instanceof Error) {
      payload.exception = sanitizeLogValue(error);
      if (error.stack) payload.stack = redactText(error.stack);
    } else if (typeof error === 'string') {
      payload.stack = redactText(error);
    } else if (error !== undefined) {
      payload.exception = sanitizeLogValue(error);
    }
    const output = this.jsonMode ? JSON.stringify(payload) : formatReadable(payload);
    process.stdout.write(output + '\n');
  }
}

function formatReadable(payload: Record<string, unknown>): string {
  const execution = JSON.stringify({
    request_id: payload.request_id,
    correlation_id: payload.correlation_id,
    trace_id: payload.trace_id,
    task_id: payload.task_id,
  });
  const extras = Object.fromEntries(Object.entries(payload).filter(([key]) => !RESERVED.has(key)));
  const suffix = Object.keys(extras).length > 0 ? ' context=' + JSON.stringify(extras) : '';
  return (
    String(payload.timestamp) +
    ' | ' +
    String(payload.level).padEnd(7) +
    ' | ' +
    String(payload.logger) +
    ' | ' +
    String(payload.message) +
    ' execution=' +
    execution +
    suffix
  );
}

@Global()
@Module({
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggingModule {}
