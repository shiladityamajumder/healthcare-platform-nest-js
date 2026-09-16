# Appointments bounded context

<p><img src="https://img.shields.io/badge/Domain-Appointments-2563EB?logo=googlecalendar&logoColor=white" alt="Appointments bounded context" /></p>

Scheduling, availability, booking, and appointment lifecycle coordination.

## Current status

This context is a command/handler-oriented scaffold and is not imported by the API composition root. Every current feature handler returns `not-implemented`; it does not expose live API behavior or persistence yet.

## Feature inventory

- `availability` — availability rules and slot discovery
- `book-appointment` — appointment booking
- `cancel-appointment` — appointment cancellation
- `reschedule-appointment` — appointment rescheduling

Each feature contains its module, controller, command, request/response DTOs, handler, and focused handler test. Implement domain rules, authorization, persistence, audit, concurrency/slot locking, and integration tests before composing this context into the API.

## Boundary rules

The supported cross-context surface is `src/public-api.ts` through `@modules/appointments`. Keep feature internals and future scheduling persistence private. Use platform database/execution contracts and documented facades or events for collaboration; do not import another context's implementation paths.
