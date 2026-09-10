// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `platform.file_access_events`. */
// Describe the database row shape consumed by repositories and transaction code.
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
