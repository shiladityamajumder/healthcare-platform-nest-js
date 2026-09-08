export const CATALOG_FACADE = Symbol('CATALOG_FACADE');

/** Stable cross-module contract. Add only operations other bounded contexts genuinely need. */
export interface CatalogFacade {
  // Intentionally empty until the first real cross-module use case is implemented.
}
