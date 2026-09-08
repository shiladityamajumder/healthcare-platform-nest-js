export const PATIENTS_FACADE = Symbol('PATIENTS_FACADE');

/** Stable cross-module contract. Add only operations other bounded contexts genuinely need. */
export interface PatientsFacade {
  // Intentionally empty until the first real cross-module use case is implemented.
}
