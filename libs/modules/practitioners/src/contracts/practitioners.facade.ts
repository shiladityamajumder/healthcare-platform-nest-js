export const PRACTITIONERS_FACADE = Symbol('PRACTITIONERS_FACADE');

/** Stable cross-module contract. Add only operations other bounded contexts genuinely need. */
export interface PractitionersFacade {
  // Intentionally empty until the first real cross-module use case is implemented.
}
