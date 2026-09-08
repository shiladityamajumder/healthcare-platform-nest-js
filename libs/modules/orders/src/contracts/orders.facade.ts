export const ORDERS_FACADE = Symbol('ORDERS_FACADE');

/** Stable cross-module contract. Add only operations other bounded contexts genuinely need. */
export interface OrdersFacade {
  // Intentionally empty until the first real cross-module use case is implemented.
}
