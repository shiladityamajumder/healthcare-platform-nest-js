/** Raw PostgreSQL row shape for `fulfillment.fulfillment_events`. */
export interface FulfillmentFulfillmentEventsRow {
  fulfillment_order_id: string; // UUID
  event_type: string; // VARCHAR(64)
  actor_user_id: string | null; // UUID
  payload: unknown; // JSONB
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
