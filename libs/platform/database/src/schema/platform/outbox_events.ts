// * Describes the raw PostgreSQL row shape for the platform.outbox_events table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `platform.outbox_events`. */
export interface PlatformOutboxEventsRow {
  aggregate_type: string; // VARCHAR(64)
  aggregate_id: string; // UUID
  event_type: string; // VARCHAR(128)
  event_version: number; // INTEGER
  payload: unknown; // JSONB
  headers: unknown; // JSONB
  occurred_at: Date; // TIMESTAMP WITH TIME ZONE
  available_at: Date; // TIMESTAMP WITH TIME ZONE
  locked_at: Date | null; // TIMESTAMP WITH TIME ZONE
  locked_by: string | null; // VARCHAR(128)
  published_at: Date | null; // TIMESTAMP WITH TIME ZONE
  publish_attempts: number; // INTEGER
  last_error: string | null; // TEXT
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
