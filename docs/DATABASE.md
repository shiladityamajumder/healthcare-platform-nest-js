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
- `query()` supports all read and write statements: `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
- Use `PostgresDatabase.transaction()` or the exported transaction manager for multi-step writes.
- Keep transaction boundaries in application use cases; repositories do not commit independently.
- Never interpolate request data into SQL text, including identifiers.
- This project does not create, alter, synchronize, migrate, or seed the database.

## Consistency

Do not hold a database transaction across an external network call. For payments, notifications, file providers, and other external work, use explicit state transitions, idempotency, retries, and an outbox or equivalent durable handoff when delivery matters.

MongoDB and Redis are optional platform integrations. Enable them only when the service is available and the owning module has a clear persistence or caching contract.

## Healthcare data

Schema design must account for classification, retention, auditability, encryption, least privilege, access reviews, and jurisdiction-specific requirements. These repository conventions do not replace a compliance or privacy review.
