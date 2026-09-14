// * Describes the raw PostgreSQL row shape for the platform.idempotency_keys table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `platform.idempotency_keys`. */
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
