// * Linked with: the module implementation and consuming bounded contexts.
// * Used by: other modules that need this capability without depending on internals.
// * Other linkup: The contract is the intended seam for cross-module integration.
export interface IntegrationEvent<TPayload = unknown> {
  readonly eventId: string;
  readonly name: string;
  readonly occurredAt: string;
  readonly version: number;
  readonly payload: TPayload;
}
