// * Describes the raw PostgreSQL row shape for the identity.api_client_secrets table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `identity.api_client_secrets`. */
export interface IdentityApiClientSecretsRow {
  api_client_id: string; // UUID
  secret_hash: string; // VARCHAR(255)
  valid_from: Date; // TIMESTAMP WITH TIME ZONE
  expires_at: Date | null; // TIMESTAMP WITH TIME ZONE
  revoked_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
