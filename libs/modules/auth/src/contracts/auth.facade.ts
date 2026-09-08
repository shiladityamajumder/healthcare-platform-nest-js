export const AUTH_FACADE = Symbol('AUTH_FACADE');

/** Stable cross-module contract. Add only operations other bounded contexts genuinely need. */
export interface AuthFacade {
  // Intentionally empty until the first real cross-module use case is implemented.
}
