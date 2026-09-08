export const PRESCRIPTIONS_FACADE = Symbol('PRESCRIPTIONS_FACADE');

/** Stable cross-module contract. Add only operations other bounded contexts genuinely need. */
export interface PrescriptionsFacade {
  // Intentionally empty until the first real cross-module use case is implemented.
}
