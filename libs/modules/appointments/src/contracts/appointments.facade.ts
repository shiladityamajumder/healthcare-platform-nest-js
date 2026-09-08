export const APPOINTMENTS_FACADE = Symbol('APPOINTMENTS_FACADE');

/** Stable cross-module contract. Add only operations other bounded contexts genuinely need. */
export interface AppointmentsFacade {
  // Intentionally empty until the first real cross-module use case is implemented.
}
