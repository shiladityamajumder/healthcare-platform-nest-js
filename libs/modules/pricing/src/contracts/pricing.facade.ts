// * Linked with: the module implementation and consuming bounded contexts.
// * Used by: other modules that need this capability without depending on internals.
// * Other linkup: The contract is the intended seam for cross-module integration.
// ? Keep this public seam narrow so consuming contexts do not depend on pricing internals.
// ! Add only stable cross-module operations that are backed by an implemented pricing use case.
export const PRICING_FACADE = Symbol('PRICING_FACADE');

/** Stable cross-module contract. Add only operations other bounded contexts genuinely need. */
// * Publish the narrow boundary that other modules can depend on.
export interface PricingFacade {
  // * Intentionally empty until the first real cross-module use case is implemented.
}
