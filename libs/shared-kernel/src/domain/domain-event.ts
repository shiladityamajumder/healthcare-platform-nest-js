// * Shared kernel: Defines the minimal framework-neutral domain-event contract.
// * File: src/domain/domain-event.ts
// ? Keep this primitive stable, domain-neutral, and independent of platform or business modules.
// ! Domain events describe facts and must not depend on Nest, persistence, or transport code.
// * Contract [DomainEvent]: Defines a stable shared-kernel data shape.
export interface DomainEvent {
  readonly occurredAt: Date;
  readonly eventName: string;
}
