/** Raw PostgreSQL row shape for `diagnostics.sample_events`. */
export interface DiagnosticsSampleEventsRow {
  sample_id: string; // UUID
  event_type: string; // VARCHAR(64)
  actor_user_id: string | null; // UUID
  location: string | null; // VARCHAR(255)
  metadata_json: unknown; // JSONB
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
