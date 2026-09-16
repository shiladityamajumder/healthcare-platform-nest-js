# Logging platform library

<p><img src="https://img.shields.io/badge/Platform-Structured%20Logs-475569?logo=opentelemetry&logoColor=white" alt="Structured logging platform" /></p>

Application-wide structured logging with request-context correlation and sensitive-data redaction. This library is technical infrastructure only and must not import a business bounded context.

## Current implementation

`LoggingModule` is global and exports `AppLogger`. The logger writes to stdout in readable mode during development and JSON mode when `LOG_JSON=true`, `LOG_JSON=1`, or `NODE_ENV=production`. `LOG_LEVEL` controls the enabled level.

`AppLogger.operation()` provides standard lifecycle methods for execution boundaries: started, completed, rejected, timed out, and failed. Log metadata is recursively sanitized for passwords, tokens, authorization headers, connection strings, secrets, cookies, private keys, and related key names. Buffers, dates, errors, circular values, and deep objects receive safe representations.

The logger currently emits stdout only. The configuration fields `LOG_TO_FILE`, `LOG_DIR`, rotation limits, and queue size are parsed by the platform configuration contract but do not install a file transport in this library. Do not log patient data, payment data, OTPs, or credentials.
