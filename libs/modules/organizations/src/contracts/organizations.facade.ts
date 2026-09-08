export const ORGANIZATIONS_FACADE = Symbol('ORGANIZATIONS_FACADE');

/** Stable cross-module contract. Add only operations other bounded contexts genuinely need. */
export interface OrganizationsFacade {
  // Intentionally empty until the first real cross-module use case is implemented.
}
