// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `membership.loyalty_accounts`. */
// Describe the database row shape consumed by repositories and transaction code.
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
