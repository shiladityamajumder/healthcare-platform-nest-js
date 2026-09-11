# Module boundaries

Boundaries are part of the system design, not a convention to remember during review. `pnpm architecture:check` validates the most important dependency rules locally and in CI.

## Rules

1. `apps/api` is the composition root. It contains bootstrap, transport-wide concerns, and health checks—not business workflows.
2. Platform libraries must not import business modules.
3. `libs/shared-kernel` must not import platform or business modules.
4. A business context may be consumed only through `@modules/<name>`.
5. Imports such as `@modules/orders/src/...` are forbidden.
6. Relative imports across two `libs/modules/<context>` trees are forbidden.
7. Domain code must not depend on application, infrastructure, or API code.
8. Application code must depend on ports and contracts, not infrastructure or API code.
9. HTTP DTOs, domain objects, and persistence entities are different models. Do not reuse one as another.
10. Repositories, SQL query files, and provider adapters remain private to their owning context.

## Allowed cross-module usage

```ts
// * Allowed: the public contract is the only import target.
import { INVENTORY_FACADE, type InventoryFacade } from '@modules/inventory';
```

```ts
// ! Forbidden: implementation details leak across the boundary.
import { StockRepository } from '@modules/inventory/src/infrastructure/...';
import { StockOrmEntity } from '@modules/inventory/src/infrastructure/...';
```

Public APIs should expose the smallest contract that a real consumer needs. An empty facade is better than exporting internal services speculatively.

## Why this matters

Process-level modularity is weaker than a network boundary: any file can technically import any other file unless the repository prevents it. Keeping contracts narrow reduces accidental coupling, clarifies ownership, and leaves a credible path to extract a context later.

## Enforcement

Run the check before committing architecture changes:

```bash
pnpm architecture:check
```

When a legitimate exception is needed, update the design and the checker together. Do not silence a violation with a broad barrel export.
