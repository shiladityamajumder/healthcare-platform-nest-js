# Module boundaries

## Non-negotiable rules

1. `apps/api` is the application composition root. It contains no business workflow.
2. `libs/platform/*` may not import business modules.
3. `libs/shared-kernel` may not import platform or business modules.
4. A business bounded context may import another bounded context only as `@modules/<name>`.
5. `@modules/<name>/...` internal imports are forbidden.
6. Relative imports crossing from one `libs/modules/<a>` tree into `libs/modules/<b>` are forbidden.
7. Domain -> application/infrastructure/API imports are forbidden.
8. Application -> infrastructure/API imports are forbidden. Depend on ports/tokens.
9. HTTP DTOs are not database entities and are not reused as domain objects.
10. Repositories and ORM entities are private to their owning bounded context.

`pnpm architecture:check` enforces the most important rules automatically.

## Public API example

```ts
// Allowed in Orders
import { INVENTORY_FACADE, InventoryFacade } from '@modules/inventory';

// Forbidden
import { StockRepository } from '../../inventory/src/infrastructure/...';
import { StockOrmEntity } from '@modules/inventory/src/infrastructure/...';
```

The public facade should be small. Exporting 30 internal services simply recreates coupling through a barrel file.
