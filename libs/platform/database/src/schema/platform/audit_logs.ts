/** Raw PostgreSQL row shape for `platform.audit_logs`. */
export interface PlatformAuditLogsRow {
  actor_user_id: string | null; // UUID
  actor_type: string; // VARCHAR(32)
  action: string; // VARCHAR(128)
  resource_type: string; // VARCHAR(128)
  resource_id: string | null; // VARCHAR(128)
  request_id: string | null; // UUID
  trace_id: string | null; // VARCHAR(64)
  ip_address: string | null; // INET
  before_data: unknown | null; // JSONB
  after_data: unknown | null; // JSONB
  metadata_json: unknown; // JSONB
  occurred_at: Date; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
