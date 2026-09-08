# Observability

Standardize at platform level:

- structured logs;
- request ID + correlation ID;
- trace/span IDs;
- latency and error metrics;
- database pool/slow-query metrics;
- outbound provider latency/failure metrics;
- business metrics owned by modules.

Each log event should identify the bounded context and feature without logging sensitive healthcare/payment data.
