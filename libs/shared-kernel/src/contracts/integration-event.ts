// * Shared kernel: Defines the versioned envelope used for cross-context integration events.
// * File: src/contracts/integration-event.ts
// ? Keep this primitive stable, domain-neutral, and independent of platform or business modules.
// ! Keep the payload generic; business-specific event contracts belong to their owning module.
// * Contract [IntegrationEvent]: Defines a stable shared-kernel data shape.
export interface IntegrationEvent<TPayload = unknown> {
  readonly eventId: string;
  readonly name: string;
  readonly occurredAt: string;
  readonly version: number;
  readonly payload: TPayload;
}
