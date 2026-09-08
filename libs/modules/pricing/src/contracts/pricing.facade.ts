export const PRICING_FACADE = Symbol('PRICING_FACADE');

/** Stable cross-module contract. Add only operations other bounded contexts genuinely need. */
export interface PricingFacade {
  // Intentionally empty until the first real cross-module use case is implemented.
}
