# Audit bounded context

<p><img src="https://img.shields.io/badge/Domain-Audit-7C3AED?logo=logstash&logoColor=white" alt="Audit bounded context" /></p>

Immutable security and operational audit-trail access.

## Current status

This context is a command/handler-oriented scaffold and is not imported by the API composition root. Its handlers currently return `not-implemented`; no audit API or persistence workflow is live.

## Feature inventory

- `get-audit-entry` — retrieve one audit entry
- `search-audit-log` — search and page through audit entries

The feature folders contain the intended module, controller, command, request/response DTOs, handler, and focused test shape. Before activation, implement immutable-write integration, actor/tenant context, authorization, filtering/pagination, retention behavior, redaction, and integration tests.

## Boundary rules

Consumers may use only `src/public-api.ts` through `@modules/audit`. Keep storage adapters and audit event details private. Audit records must not be treated as mutable business data, and sensitive values must remain redacted in both records and logs.
