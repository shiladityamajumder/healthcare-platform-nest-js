/** Raw PostgreSQL row shape for `identity.password_history`. */
export interface IdentityPasswordHistoryRow {
  user_id: string; // UUID
  password_hash: string; // VARCHAR(255)
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
