# 🛒 Orders bounded context

Order lifecycle, status transitions, and returns.

## Ownership

This context owns its HTTP endpoints, application use cases, domain rules, persistence adapters, tests, and cross-module contract. Consumers outside the context may import only `@modules/orders`; implementation paths under `src/features`, `src/domain`, and `src/infrastructure` are private.

## Feature inventory

- `cancel-order`
- `create-order`
- `get-order`
- `list-orders`
- `returns`
- `update-status`

These directories describe the current scaffolded capability surface. A feature is not considered production-ready until its handler, persistence behavior, authorization, audit requirements, and relevant tests are implemented.

## Boundary notes

- Keep business rules inside this context.
- Expose only narrow, real contracts through `src/public-api.ts`.
- Keep SQL repositories, query files, and provider adapters private.
- Use integration events or a documented facade for cross-context collaboration.
