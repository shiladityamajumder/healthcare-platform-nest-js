# 📘 Database conventions

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="72" alt="NestJS logo" />
</p>

<p align="center">
  <img src="../assets/readme/healthcare-platform-banner.png" alt="Abstract healthcare platform backend architecture banner" width="100%" />
</p>

`libs/platform/database` is a client-only PostgreSQL access library. It owns the connection pool, parameterized raw query helper, and transaction primitives. The PostgreSQL database, schemas, tables, constraints, and indexes are managed externally and must already exist before this application starts.

Business contexts own their SQL repositories and query strings. Most scaffolded contexts use an infrastructure tree:

```text
libs/modules/<context>/src/infrastructure/persistence/postgres/
├── repositories/
└── queries/
```

Auth is the implemented flat-feature variant: identity and OTP repositories
live under `src/features/registration`, session persistence under
`src/features/session-management`, and RBAC persistence under
`src/features/administration`. Its `src/infrastructure/persistence/auth.repository.ts`
is only a small DI facade and contains no SQL.

## 🔹 Raw SQL rules

- Use `PostgresDatabase.query()` with `$1`, `$2`, ... parameters for all values.
- Use the fixed `TABLES` constants for schema-qualified table identifiers.
- Use the exported `*Row` interfaces as query result types.
- `query()` supports all read and write statements: `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
- Keep multi-step writes inside the operation execution boundary (or `PostgresDatabase.transaction()` for low-level infrastructure work).
- Repositories do not commit, roll back, create pools, or call `pool.query()` directly.
- Never interpolate request data into SQL text, including identifiers.
- This project does not create, alter, synchronize, migrate, or seed the database.

The standalone [identity master-data seed](17-IDENTITY-MASTER-DATA-SEED.md) is the
documented exception for operational RBAC bootstrap. It seeds only the managed
identity roles, permissions, and role-permission mappings after the external
identity migrations have created those tables.

## 🔹 Execution and rollback

HTTP handlers are automatically wrapped by `OperationExecutionInterceptor`. A normal business request therefore has this flow:

```text
HTTP request
  -> request context middleware
  -> execution boundary (logs + BEGIN)
  -> controller -> application service/handler -> SQL repository
  -> COMMIT on success
  -> ROLLBACK and rethrow on any failure
```

`PostgresDatabase.query()` detects the active transaction client through `AsyncLocalStorage`, so every repository query in that operation participates in the same transaction. For background jobs and message consumers, call `ExecutionService.execute()` explicitly and set `transactional: true` for workflows that write data.

Use `@NonTransactional()` only for endpoints that must not access PostgreSQL, such as liveness/readiness checks. Do not hold a database transaction across an external network call. For payments, notifications, file providers, and other external work, use explicit state transitions, idempotency, retries, and an outbox or equivalent durable handoff when delivery matters.

Auth's capabilities and JWKS discovery endpoints are the intentional
non-transactional exceptions. Registration, OTP verification, password reset,
RBAC replacement, and session rotation remain within one transaction; refresh
rotation also locks the session row to prevent concurrent double use.

## 🔹 Consistency

MongoDB and Redis are optional platform integrations. Enable them only when the service is available and the owning module has a clear persistence or caching contract.

## 🔹 Healthcare data

Schema design must account for classification, retention, auditability, encryption, least privilege, access reviews, and jurisdiction-specific requirements. These repository conventions do not replace a compliance or privacy review.
