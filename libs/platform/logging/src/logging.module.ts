import { Global, Injectable, Logger, Module } from '@nestjs/common';

export type LogMetadata = Readonly<Record<string, unknown>>;

/** Application logger boundary. Keep business rules out of this library. */
@Injectable()
export class AppLogger extends Logger {
  public constructor() {
    super('AppLogger');
  }

  public debugEvent(message: string, metadata: LogMetadata = {}): void {
    super.debug(formatEvent(message, metadata));
  }

  public infoEvent(message: string, metadata: LogMetadata = {}): void {
    super.log(formatEvent(message, metadata));
  }

  public warnEvent(message: string, metadata: LogMetadata = {}): void {
    super.warn(formatEvent(message, metadata));
  }

  public errorEvent(message: string, metadata: LogMetadata = {}, error?: unknown): void {
    const stack = error instanceof Error ? error.stack : undefined;
    super.error(formatEvent(message, metadata), stack);
  }
}

function formatEvent(message: string, metadata: LogMetadata): string {
  const safeMetadata = Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => [key, sanitize(key, value)]),
  );
  return Object.keys(safeMetadata).length === 0
    ? message
    : `${message} ${JSON.stringify(safeMetadata)}`;
}

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
