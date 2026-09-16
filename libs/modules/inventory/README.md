# Inventory bounded context

<p><img src="https://img.shields.io/badge/Domain-Inventory-D97706?logo=box&logoColor=white" alt="Inventory bounded context" /></p>

Stock balances, reservations, transfers, adjustments, and warehouses.

## Current status

This context is a command/handler-oriented scaffold and is not imported by the API composition root. Every feature handler returns `not-implemented`; no inventory route or persistence workflow is live.

## Feature inventory

- `warehouses` — warehouse management
- `get-stock` — stock lookup
- `reserve-stock` — reserve available stock
- `release-reservation` — release a reservation
- `adjust-stock` — record an adjustment
- `transfer-stock` — transfer stock between locations

Each feature contains the intended module, controller, command, request/response DTOs, handler, and focused test shape. Implement atomic stock-ledger behavior, reservation expiry, idempotency, concurrency locking, authorization, audit, and integration tests before activation.

## Boundary rules

Use only `src/public-api.ts` through `@modules/inventory` for cross-context imports. Keep stock SQL and warehouse provider details private. Inventory operations must use the shared execution/transaction boundary rather than opening local transactions.
