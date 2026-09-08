# Database conventions

## Ownership

`libs/platform/database` owns connection lifecycle, PostgreSQL options, and transaction primitives. A business context owns its tables, ORM entities, repositories, and migrations under its own infrastructure tree.

```text
libs/modules/<context>/src/infrastructure/persistence/typeorm/
├── entities/
├── repositories/
└── migrations/
```

The default TypeORM configuration has `synchronize: false`. Schema evolution is migration-first.

## Design rules

- Every table has one owning bounded context.
- Enforce critical invariants with database constraints, not only application checks.
- Use opaque identifiers at module and API boundaries.
- Use optimistic versioning for frequently edited records.
- Lock rows in a deterministic order when a workflow updates multiple records.
- Keep transactions inside application use cases; repositories do not commit independently.
- Do not join private tables from another context in write-side business logic.
- Use read models or explicit contracts for cross-context reporting.

## Consistency

Do not hold a database transaction across an external network call. For payments, notifications, file providers, and other external work, use explicit state transitions, idempotency, retries, and an outbox or equivalent durable handoff when delivery matters.

## Healthcare data

Schema design must account for classification, retention, auditability, encryption, least privilege, access reviews, and jurisdiction-specific requirements. These repository conventions do not replace a compliance or privacy review.

MongoDB and Redis are optional platform integrations. Enable them only when the service is available and the owning module has a clear persistence or caching contract.
