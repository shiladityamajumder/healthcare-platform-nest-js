# Database conventions

`libs/platform/database` is a client-only PostgreSQL access library. It owns the connection pool, parameterized raw query helper, and transaction primitives. The PostgreSQL database, schemas, tables, constraints, and indexes are managed externally and must already exist before this application starts.

Business contexts own their SQL repositories and query strings under their own infrastructure tree:

```text
libs/modules/<context>/src/infrastructure/persistence/postgres/
├── repositories/
└── queries/
```

## Raw SQL rules

- Use `PostgresDatabase.query()` with `$1`, `$2`, ... parameters for all values.
- Use the fixed `TABLES` constants for schema-qualified table identifiers.
- Use the exported `*Row` interfaces as query result types.
- `query()` supports all read and write statements: `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
- Keep multi-step writes inside `ExecutionService` (or `PostgresDatabase.transaction()` for low-level infrastructure work).
- Repositories do not commit, roll back, create pools, or call `pool.query()` directly.
- Never interpolate request data into SQL text, including identifiers.
- This project does not create, alter, synchronize, migrate, or seed the database.

## Execution and rollback

HTTP handlers are automatically wrapped by `OperationExecutionInterceptor`. A normal business request therefore has this flow:

```text
HTTP request
  -> request context middleware
  -> execution boundary (logs + BEGIN)
  -> controller -> application handler -> SQL repository
  -> COMMIT on success
  -> ROLLBACK and rethrow on any failure
```

`PostgresDatabase.query()` detects the active transaction client through `AsyncLocalStorage`, so every repository query in that operation participates in the same transaction. For background jobs and message consumers, call `ExecutionService.execute()` explicitly and set `transactional: true` for workflows that write data.

Use `@NonTransactional()` only for endpoints that must not access PostgreSQL, such as liveness/readiness checks. Do not hold a database transaction across an external network call. For payments, notifications, file providers, and other external work, use explicit state transitions, idempotency, retries, and an outbox or equivalent durable handoff when delivery matters.

## Consistency

MongoDB and Redis are optional platform integrations. Enable them only when the service is available and the owning module has a clear persistence or caching contract.

## Healthcare data

Schema design must account for classification, retention, auditability, encryption, least privilege, access reviews, and jurisdiction-specific requirements. These repository conventions do not replace a compliance or privacy review.
