# Organizations bounded context

<p><img src="https://img.shields.io/badge/Domain-Organizations-4F46E5?logo=workplace&logoColor=white" alt="Organizations bounded context" /></p>

Organizations, facilities, and the structure used to scope healthcare operations.

## Current status

This context is a command/handler-oriented scaffold and is not imported by the API composition root. Its handlers return `not-implemented`; no organization route or persistence workflow is live.

## Feature inventory

- `create-organization` — create an organization
- `get-organization` — retrieve an organization
- `update-organization` — update organization data
- `facilities` — manage facilities within an organization

Each feature contains the intended module, controller, command, request/response DTOs, handler, and focused test shape. Implement tenant boundaries, membership/ownership rules, validation, persistence, authorization, audit, and integration tests before activation.

## Boundary rules

Consumers may import only `src/public-api.ts` through `@modules/organizations`. Keep organization persistence and facility rules private. Request context provides the technical place for tenant/organization identifiers; business authorization belongs in this context.
