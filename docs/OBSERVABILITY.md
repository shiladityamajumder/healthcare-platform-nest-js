# Observability

Observability is a platform concern with business context supplied by each module. Every production request should be diagnosable without exposing sensitive healthcare, authentication, payment, or file data.

## Minimum signals

- Structured logs with timestamp, level, service, bounded context, feature, outcome, and duration.
- Request and correlation IDs propagated in headers and log context.
- Trace and span IDs when distributed tracing is enabled.
- HTTP latency, throughput, status, and error-rate metrics.
- Database pool saturation, query latency, migration status, and connection errors.
- External-provider latency, timeout, retry, and failure metrics.
- Business metrics owned by the relevant context, such as appointment booking or payment transitions.

## Operational rules

- Use stable event names and field types so dashboards survive refactors.
- Redact tokens, passwords, clinical content, payment secrets, and file contents.
- Treat audit events as a separate durable record from debug logs.
- Alert on user-visible failure and saturation, not only process crashes.
- Include deployment version and environment in telemetry.
- Document retention and access controls for logs, traces, and audit records.

The current repository provides request context and basic logging hooks; production telemetry backends, dashboards, alerts, and redaction policies still need environment-specific implementation.
