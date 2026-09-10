// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `identity.api_clients`. */
// Describe the database row shape consumed by repositories and transaction code.
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
