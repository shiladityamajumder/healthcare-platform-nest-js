export const AUDIT_FACADE = Symbol('AUDIT_FACADE');

/** Stable cross-module contract. Add only operations other bounded contexts genuinely need. */
export interface AuditFacade {
  // Intentionally empty until the first real cross-module use case is implemented.
}
