// Linked with: the surrounding package and its exported types.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
export interface DomainEvent {
  readonly occurredAt: Date;
  readonly eventName: string;
}
