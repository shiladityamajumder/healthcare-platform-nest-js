// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `platform.webhook_deliveries`. */
// * Describe the database row shape consumed by repositories and transaction code.
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
