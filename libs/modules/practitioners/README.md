# Practitioners bounded context

<p><img src="https://img.shields.io/badge/Domain-Practitioners-0369A1?logo=medrt&logoColor=white" alt="Practitioners bounded context" /></p>

Practitioner profiles, licenses, and professional identity data.

## Current status

This context is a command/handler-oriented scaffold and is not imported by the API composition root. Its handlers return `not-implemented`; no practitioner route or persistence workflow is live.

## Feature inventory

- `create-profile` — create a practitioner profile
- `get-profile` — retrieve a practitioner profile
- `update-profile` — update a practitioner profile
- `licenses` — manage license records

Each feature contains the intended module, controller, command, request/response DTOs, handler, and focused test shape. Implement credential/licensing validation, organization scope, authorization, audit, persistence, and integration tests before activation.

## Boundary rules

Use only `src/public-api.ts` through `@modules/practitioners` for cross-context imports. Keep licensing rules and provider/persistence adapters private. Protected practitioner data must not leak into logs or generic shared types.
