export const INVENTORY_FACADE = Symbol('INVENTORY_FACADE');

/** Stable cross-module contract. Add only operations other bounded contexts genuinely need. */
export interface InventoryFacade {
  // Intentionally empty until the first real cross-module use case is implemented.
}
