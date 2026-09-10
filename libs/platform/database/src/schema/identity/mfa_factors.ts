// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `identity.mfa_factors`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface IdentityMfaFactorsRow {
  user_id: string; // UUID
  factor_type: string; // VARCHAR(32)
  label: string; // VARCHAR(64)
  secret_encrypted: Buffer | null; // BYTEA
  destination_masked: string | null; // VARCHAR(255)
  verified_at: Date | null; // TIMESTAMP WITH TIME ZONE
  disabled_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
