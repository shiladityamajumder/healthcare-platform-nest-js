// * Linked with: the module implementation and consuming bounded contexts.
// * Used by: other modules that need this capability without depending on internals.
// * Other linkup: The contract is the intended seam for cross-module integration.
export const AUDIT_FACADE = Symbol('AUDIT_FACADE');

/** Stable cross-module contract. Add only operations other bounded contexts genuinely need. */
// * Publish the narrow boundary that other modules can depend on.
export interface AuditFacade {
  // * Intentionally empty until the first real cross-module use case is implemented.
}
