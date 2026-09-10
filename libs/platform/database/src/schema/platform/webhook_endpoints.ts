/** Raw PostgreSQL row shape for `platform.webhook_endpoints`. */
export interface PlatformWebhookEndpointsRow {
  owner_type: string; // VARCHAR(64)
  owner_id: string; // UUID
  url_encrypted: Buffer; // BYTEA
  secret_hash: string; // VARCHAR(255)
  subscribed_events: unknown; // JSONB
  status: string; // VARCHAR(32)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  is_deleted: boolean; // BOOLEAN
  deleted_at: Date | null; // TIMESTAMP WITH TIME ZONE
  deleted_by: string | null; // UUID
  row_version: string; // BIGINT
}
