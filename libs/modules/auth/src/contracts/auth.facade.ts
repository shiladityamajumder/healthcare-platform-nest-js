/**
 * Public integration seam for consumers outside the auth bounded context.
 * Used backward by future consuming modules; connects forward to an explicit auth facade implementation.
 */
export const AUTH_FACADE = Symbol('AUTH_FACADE');

/** Keep this contract narrow; do not expose repositories or feature internals here. */
export interface AuthFacade {
  // Intentionally empty until a real cross-module use case is implemented.
}
