export const PAYMENTS_FACADE = Symbol('PAYMENTS_FACADE');

/** Stable cross-module contract. Add only operations other bounded contexts genuinely need. */
export interface PaymentsFacade {
  // Intentionally empty until the first real cross-module use case is implemented.
}
