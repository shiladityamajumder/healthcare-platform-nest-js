// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `identity.login_attempts`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface IdentityLoginAttemptsRow {
  user_id: string | null; // UUID
  login_identifier_hash: string; // VARCHAR(255)
  success: boolean; // BOOLEAN
  failure_code: string | null; // VARCHAR(64)
  ip_address: string | null; // INET
  user_agent: string | null; // TEXT
  request_id: string | null; // UUID
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
