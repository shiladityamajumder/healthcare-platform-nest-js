// * Describes the raw PostgreSQL row shape for the identity.otp_challenges table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `identity.otp_challenges`. */
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
