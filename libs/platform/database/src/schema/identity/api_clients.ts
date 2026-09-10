/** Raw PostgreSQL row shape for `identity.api_clients`. */
export interface IdentityApiClientsRow {
  client_name: string; // VARCHAR(128)
  client_key: string; // VARCHAR(128)
  secret_hash: string; // VARCHAR(255)
  allowed_scopes: unknown; // JSONB
  allowed_cidrs: unknown; // JSONB
  status: string; // VARCHAR(16)
  last_used_at: Date | null; // TIMESTAMP WITH TIME ZONE
  secret_rotated_at: Date | null; // TIMESTAMP WITH TIME ZONE
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
