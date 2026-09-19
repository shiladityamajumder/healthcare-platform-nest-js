// * Catalog module: Normalizes request context values used by catalog services.
// * File: src/contracts/catalog-context.ts
// ? Keep transport-to-application normalization outside domain rules.
export function actorId(value?: string): string | null {
  return value &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? value
    : null;
}
