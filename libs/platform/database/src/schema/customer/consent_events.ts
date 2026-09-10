/** Raw PostgreSQL row shape for `customer.consent_events`. */
export interface CustomerConsentEventsRow {
  consent_id: string; // UUID
  event_type: string; // VARCHAR(32)
  actor_user_id: string | null; // UUID
  request_id: string | null; // UUID
  metadata_json: unknown; // JSONB
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
