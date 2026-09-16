# Payments bounded context

<p><img src="https://img.shields.io/badge/Domain-Payments-15803D?logo=stripe&logoColor=white" alt="Payments bounded context" /></p>

Payment intent lifecycle, capture, refunds, and provider webhooks.

## Current status

This context is a command/handler-oriented scaffold and is not imported by the API composition root. All current handlers return `not-implemented`; no payment route or provider integration is live.

## Feature inventory

- `create-payment` — create a payment intent
- `capture-payment` — capture an authorized payment
- `refund-payment` — issue a refund
- `webhook` — receive provider events

Each feature contains the intended module, controller, command, request/response DTOs, handler, and focused test shape. Implement provider adapters, signature verification, idempotency, state transitions, reconciliation, authorization, audit, secret redaction, and integration tests before activation.

## Boundary rules

Consumers may import only `src/public-api.ts` through `@modules/payments`. Keep provider SDKs, webhook secrets, card/payment data, and persistence private. Never log payment credentials or raw provider payloads without redaction.
