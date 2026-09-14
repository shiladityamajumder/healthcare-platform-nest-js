// * Describes the raw PostgreSQL row shape for the platform.webhook_deliveries table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `platform.webhook_deliveries`. */
export interface PlatformWebhookDeliveriesRow {
  endpoint_id: string; // UUID
  event_id: string; // UUID
  event_type: string; // VARCHAR(128)
  payload: unknown; // JSONB
  status: string; // VARCHAR(32)
  attempt_count: number; // INTEGER
  last_response_code: number | null; // INTEGER
  next_attempt_at: Date | null; // TIMESTAMP WITH TIME ZONE
  delivered_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
