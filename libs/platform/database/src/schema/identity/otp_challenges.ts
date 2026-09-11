// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `identity.otp_challenges`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface IdentityOtpChallengesRow {
  channel: string; // VARCHAR(16)
  destination_hash: string; // VARCHAR(255)
  purpose: string; // VARCHAR(32)
  otp_hash: string; // VARCHAR(255)
  attempts: number; // INTEGER
  max_attempts: number; // INTEGER
  expires_at: Date; // TIMESTAMP WITH TIME ZONE
  consumed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  blocked_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
