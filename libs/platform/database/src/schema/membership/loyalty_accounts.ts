// * Describes the raw PostgreSQL row shape for the membership.loyalty_accounts table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `membership.loyalty_accounts`. */
export interface MembershipLoyaltyAccountsRow {
  user_id: string; // UUID
  points_balance: string; // NUMERIC(18, 3)
  tier: string; // VARCHAR(32)
  tier_expires_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
