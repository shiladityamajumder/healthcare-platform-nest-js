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
