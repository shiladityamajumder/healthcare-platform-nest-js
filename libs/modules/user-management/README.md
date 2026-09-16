# User management bounded context

<p><img src="https://img.shields.io/badge/Domain-User%20Management-334155?logo=linux&logoColor=white" alt="User management bounded context" /></p>

User lifecycle and administrative user access outside the authentication implementation.

## Current status

This context is a command/handler-oriented scaffold and is not imported by the API composition root. All current feature handlers return `not-implemented`; the live auth administration endpoints currently own identity/RBAC administration.

## Feature inventory

- `create-user` — create a user
- `get-user` — retrieve a user
- `list-users` — list users
- `update-user` — update a user
- `activate-user` — activate a user
- `roles` — manage user-management role workflows

Each feature contains the intended module, controller, command, request/response DTOs, handler, and focused test shape. Resolve the ownership boundary with auth before activation, then implement authorization, tenant scope, audit, persistence, and integration tests.

## Boundary rules

Consumers may import only `src/public-api.ts` through `@modules/user-management`. Do not duplicate auth repositories or import `@modules/auth` internals. Cross-context identity operations must use the narrow auth facade once that contract has a real operation.
