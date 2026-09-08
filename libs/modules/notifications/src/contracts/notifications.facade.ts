export const NOTIFICATIONS_FACADE = Symbol('NOTIFICATIONS_FACADE');

/** Stable cross-module contract. Add only operations other bounded contexts genuinely need. */
export interface NotificationsFacade {
  // Intentionally empty until the first real cross-module use case is implemented.
}
