# 📁 File management bounded context

File lifecycle orchestration and controlled access URLs.

## Ownership

This context owns its HTTP endpoints, application use cases, domain rules, persistence adapters, tests, and cross-module contract. Consumers outside the context may import only `@modules/file-management`; implementation paths under `src/features`, `src/domain`, and `src/infrastructure` are private.

## Feature inventory

- `complete-upload`
- `delete-file`
- `generate-download-url`
- `get-file`
- `initiate-upload`

These directories describe the current scaffolded capability surface. A feature is not considered production-ready until its handler, persistence behavior, authorization, audit requirements, and relevant tests are implemented.

## Boundary notes

- Keep business rules inside this context.
- Expose only narrow, real contracts through `src/public-api.ts`.
- Keep SQL repositories, query files, and provider adapters private.
- Use integration events or a documented facade for cross-context collaboration.
