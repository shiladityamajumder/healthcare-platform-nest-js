// * Provides structured application logging for the application.
// * Used by modules and application bootstrap code through the platform public API.
// ! Keep business rules in module code; this layer supplies reusable technical capabilities.
import { Global, Injectable, Logger, Module } from '@nestjs/common';

export type LogMetadata = Readonly<Record<string, unknown>>;

/** Application logger boundary. Keep business rules out of this library. */
@Injectable()
export class AppLogger extends Logger {
  // * Initializes the shared logger with a stable context name for structured application events.
  public constructor() {
    super('AppLogger');
  }

  // * Writes a debug-level event after applying the platform metadata format.
  public debugEvent(message: string, metadata: LogMetadata = {}): void {
    super.debug(formatEvent(message, metadata));
  }

  // * Writes an informational event after applying the platform metadata format.
  public infoEvent(message: string, metadata: LogMetadata = {}): void {
    super.log(formatEvent(message, metadata));
  }

  // * Writes a warning event after applying the platform metadata format.
  public warnEvent(message: string, metadata: LogMetadata = {}): void {
    super.warn(formatEvent(message, metadata));
  }

  // * Writes an error event and includes an Error stack when one is available.
  public errorEvent(message: string, metadata: LogMetadata = {}, error?: unknown): void {
    const stack = error instanceof Error ? error.stack : undefined;
    super.error(formatEvent(message, metadata), stack);
  }
}

// * Serializes event metadata into one log message after sensitive values are sanitized.
function formatEvent(message: string, metadata: LogMetadata): string {
  const safeMetadata = Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => [key, sanitize(key, value)]),
  );
  return Object.keys(safeMetadata).length === 0
    ? message
    : `${message} ${JSON.stringify(safeMetadata)}`;
}

// * Redacts credentials and normalizes values that JSON.stringify cannot represent directly.
function sanitize(key: string, value: unknown): unknown {
  if (/(password|token|secret|authorization|cookie|otp|code)/i.test(key)) {
    return '[REDACTED]';
  }
  if (value instanceof Error) return value.name;
  if (typeof value === 'bigint') return value.toString();
  return value;
}

@Global()
@Module({
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggingModule {}
