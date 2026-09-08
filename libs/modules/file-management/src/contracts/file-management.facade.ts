export const FILE_MANAGEMENT_FACADE = Symbol('FILE_MANAGEMENT_FACADE');

/** Stable cross-module contract. Add only operations other bounded contexts genuinely need. */
export interface FileManagementFacade {
  // Intentionally empty until the first real cross-module use case is implemented.
}
