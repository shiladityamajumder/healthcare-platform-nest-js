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
