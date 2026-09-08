# Database conventions

- Shared connection/pool configuration: `libs/platform/database`.
- PostgreSQL/TypeORM options: `libs/platform/database/src/postgres/postgres.options.ts`.
- MongoDB client lifecycle and database handle: `libs/platform/database/src/mongo`.
- Redis client lifecycle, namespaced keys and cache primitives: `libs/platform/cache`.
- Module-owned ORM entities, repositories and migrations: `libs/modules/<module>/src/infrastructure/persistence/typeorm`.
- `synchronize: false` always in committed code.
- Migration-first schema evolution.
- Prefer UUID/ULID-like opaque identifiers for cross-boundary references.
- Add database constraints for business invariants that must survive races.
- Use deterministic row locking order for multi-row inventory/order workflows.
- Use optimistic version columns where concurrent edits are common.
- Never let a repository commit its own transaction.
- Avoid cross-module joins in write-side business logic; use explicit contracts/read models.

For healthcare data, schema design must also account for retention, auditability, encryption requirements, least-privilege access, and jurisdiction-specific regulatory obligations before production rollout.

MongoDB and Redis are optional integrations. Set `MONGO_ENABLED=true` or
`REDIS_ENABLED=true` only when the corresponding service is available. Business
modules should depend on ports or these platform adapters, while collections,
documents and repositories remain owned by the business module using them.
