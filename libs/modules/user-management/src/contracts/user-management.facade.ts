export const USER_MANAGEMENT_FACADE = Symbol('USER_MANAGEMENT_FACADE');

/** Stable cross-module contract. Add only operations other bounded contexts genuinely need. */
export interface UserManagementFacade {
  // Intentionally empty until the first real cross-module use case is implemented.
}
