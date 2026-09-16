# Orders bounded context

<p><img src="https://img.shields.io/badge/Domain-Orders-16A34A?logo=shopify&logoColor=white" alt="Orders bounded context" /></p>

Order creation, lifecycle/status transitions, cancellation, and returns.

## Current status

This context is a command/handler-oriented scaffold and is not imported by the API composition root. Every current feature handler returns `not-implemented`; no order route or persistence workflow is live.

## Feature inventory

- `create-order` — create an order
- `get-order` — retrieve an order
- `list-orders` — list orders with pagination/filtering
- `update-status` — transition order status
- `cancel-order` — cancel an order
- `returns` — manage returns

Each feature contains the intended module, controller, command, request/response DTOs, handler, and focused test shape. Implement order invariants, pricing/inventory coordination, idempotency, status transition rules, authorization, payment/refund integration, audit, and integration tests before activation.

## Boundary rules

Use only `src/public-api.ts` through `@modules/orders` from outside the context. Keep order persistence and external provider adapters private. Cross-context calls must use a documented facade or integration event and must preserve the shared transaction policy.
