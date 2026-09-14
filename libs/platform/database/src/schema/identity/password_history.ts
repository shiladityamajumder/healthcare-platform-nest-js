// * Describes the raw PostgreSQL row shape for the identity.password_history table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `identity.password_history`. */
export interface IdentityPasswordHistoryRow {
  user_id: string; // UUID
  password_hash: string; // VARCHAR(255)
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
