// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `identity.password_history`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface IdentityPasswordHistoryRow {
  user_id: string; // UUID
  password_hash: string; // VARCHAR(255)
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
