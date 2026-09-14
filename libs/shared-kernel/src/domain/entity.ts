// * Shared kernel: Defines the base identity-bearing entity primitive for domain models.
// * File: src/domain/entity.ts
// ? Keep this primitive stable, domain-neutral, and independent of platform or business modules.
// ! Keep entity behavior framework-neutral and let owning modules define business rules.
// * Type [Entity]: Provides a reusable framework-neutral shared-kernel primitive.
export abstract class Entity<TId> {
  // * Function [constructor]: Initializes this primitive with its required state.
  protected constructor(public readonly id: TId) {}
}
