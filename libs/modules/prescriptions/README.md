# Prescriptions bounded context

<p><img src="https://img.shields.io/badge/Domain-Prescriptions-B91C1C?logo=healthicons&logoColor=white" alt="Prescriptions bounded context" /></p>

Prescription creation, review, document association, and access control.

## Current status

This context is a command/handler-oriented scaffold and is not imported by the API composition root. Every current feature handler returns `not-implemented`; no prescription route or persistence workflow is live.

## Feature inventory

- `create-prescription` — create a prescription
- `get-prescription` — retrieve a prescription
- `review-prescription` — review or change prescription state
- `attach-document` — associate a controlled document

Each feature contains the intended module, controller, command, request/response DTOs, handler, and focused test shape. Implement practitioner/patient authorization, clinical invariants, document access rules, audit, retention, persistence, and integration tests before activation.

## Boundary rules

Consumers may import only `src/public-api.ts` through `@modules/prescriptions`. Keep protected health information, prescription documents, SQL, and storage adapters private. Coordinate file access through a documented file-management contract rather than importing its internals.
