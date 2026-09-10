// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `platform.idempotency_keys`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface PlatformIdempotencyKeysRow {
  scope: string; // VARCHAR(128)
  idempotency_key: string; // VARCHAR(128)
  request_hash: string; // VARCHAR(64)
  request_metadata: unknown; // JSONB
  response_code: number | null; // INTEGER
  response_body: unknown; // JSONB
  locked_until: Date | null; // TIMESTAMP WITH TIME ZONE
  expires_at: Date; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
