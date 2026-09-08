export interface IntegrationEvent<TPayload = unknown> {
  readonly eventId: string;
  readonly name: string;
  readonly occurredAt: string;
  readonly version: number;
  readonly payload: TPayload;
}
