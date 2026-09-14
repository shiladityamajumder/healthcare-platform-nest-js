// * Describes the raw PostgreSQL row shape for the platform.file_access_events table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `platform.file_access_events`. */
export interface PlatformFileAccessEventsRow {
  file_object_id: string; // UUID
  actor_user_id: string | null; // UUID
  action: string; // VARCHAR(32)
  decision: string; // VARCHAR(16)
  purpose: string; // VARCHAR(128)
  request_id: string; // UUID
  ip_address: string | null; // INET
  user_agent: string | null; // TEXT
  signed_url_expires_at: Date | null; // TIMESTAMP WITH TIME ZONE
  metadata_json: unknown; // JSONB
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
