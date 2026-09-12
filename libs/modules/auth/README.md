# 🔐 Authentication bounded context

Identity entry points, credentials, sessions, and verification workflows.

## Ownership

This context owns its HTTP endpoints, application use cases, domain rules, persistence adapters, tests, and cross-module contract. Consumers outside the context may import only `@modules/auth`; implementation paths under `src/features`, `src/domain`, and `src/infrastructure` are private.

## Feature inventory

- `change-password`
- `forgot-password`
- `login`
- `logout`
- `mfa`
- `refresh-token`
- `registration`
- `reset-password`
- `verify-email`

The HTTP contract is implemented in `src/api/http/v1`. Controllers are transport-only and delegate to `AuthApplicationService`. Persistence is implemented by the DI-bound `AuthPostgresRepository` under `src/infrastructure/persistence/postgres`; it uses parameterized SQL through the shared transaction-aware `PostgresDatabase`. No ORM, entities, schema synchronization, or migration execution is used by this context.

The initial port preserves the FastAPI endpoint paths and camel-case request/response fields. Authentication/session operations run inside the existing operation-execution transaction boundary, which supplies unified execution logging and rollback behavior. Public capability and JWKS discovery endpoints are explicitly marked non-transactional.

## Boundary notes

- Keep business rules inside this context.
- Expose only narrow, real contracts through `src/public-api.ts`.
- Keep SQL repositories, query files, and provider adapters private.
- Use integration events or a documented facade for cross-context collaboration.
