# 🧑‍⚕️ Patients bounded context

Patient profiles, addresses, and consent records.

## Ownership

This context owns its HTTP endpoints, application use cases, domain rules, persistence adapters, tests, and cross-module contract. Consumers outside the context may import only `@modules/patients`; implementation paths under `src/features`, `src/domain`, and `src/infrastructure` are private.

## Feature inventory

- `addresses`
- `consents`
- `create-profile`
- `get-profile`
- `update-profile`

These directories describe the current scaffolded capability surface. A feature is not considered production-ready until its handler, persistence behavior, authorization, audit requirements, and relevant tests are implemented.

## Boundary notes

- Keep business rules inside this context.
- Expose only narrow, real contracts through `src/public-api.ts`.
- Keep ORM entities, repositories, migrations, and provider adapters private.
- Use integration events or a documented facade for cross-context collaboration.
