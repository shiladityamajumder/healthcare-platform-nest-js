# Inventory bounded context

<p><img src="https://img.shields.io/badge/Domain-Inventory-D97706?logo=box&logoColor=white" alt="Inventory bounded context" /></p>

Stock balances, reservations, transfers, adjustments, and warehouses.

## Current status

The API composition root now mounts the inventory context and exposes the legacy inventory, transfer, warehouse, bin, and replenishment routes. The handlers remain a command/handler-oriented scaffold and return `not-implemented` until the inventory repositories and workflows are connected.

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
