# Patients bounded context

<p><img src="https://img.shields.io/badge/Domain-Patients-0F766E?logo=healthcare&logoColor=white" alt="Patients bounded context" /></p>

Patient profiles, addresses, and consent records.

## Current status

This context is a command/handler-oriented scaffold and is not imported by the API composition root. Every current feature handler returns `not-implemented`; no patient route or persistence workflow is live.

## Feature inventory

- `create-profile` — create a patient profile
- `get-profile` — retrieve a patient profile
- `update-profile` — update a patient profile
- `addresses` — manage patient addresses
- `consents` — manage consent records

Each feature contains the intended module, controller, command, request/response DTOs, handler, and focused test shape. Implement privacy/tenant authorization, consent history, validation, audit, data retention, persistence, and integration tests before activation.

## Boundary rules

Use only `src/public-api.ts` through `@modules/patients` for cross-context imports. Keep patient data and persistence adapters private. Do not place protected health information in logs, errors, test fixtures, or shared-kernel types.
