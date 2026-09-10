// Linked with: the surrounding package and its exported types.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
export abstract class Entity<TId> {
  protected constructor(public readonly id: TId) {}
}
