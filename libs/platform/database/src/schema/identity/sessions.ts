// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `identity.sessions`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface IdentitySessionsRow {
  user_id: string; // UUID
  refresh_token_hash: string; // VARCHAR(255)
  token_family_id: string; // UUID
  device_id: string | null; // VARCHAR(255)
  device_type: string | null; // VARCHAR(32)
  ip_address: string | null; // INET
  user_agent: string | null; // TEXT
  expires_at: Date; // TIMESTAMP WITH TIME ZONE
  last_seen_at: Date | null; // TIMESTAMP WITH TIME ZONE
  revoked_at: Date | null; // TIMESTAMP WITH TIME ZONE
  revoke_reason: string | null; // VARCHAR(255)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
