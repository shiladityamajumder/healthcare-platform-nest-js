// * Describes the raw PostgreSQL row shape for the membership.loyalty_ledger table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `membership.loyalty_ledger`. */
export interface MembershipLoyaltyLedgerRow {
  loyalty_account_id: string; // UUID
  movement_type: string; // VARCHAR(32)
  points: string; // NUMERIC(18, 3)
  reference_type: string; // VARCHAR(32)
  reference_id: string; // UUID
  expires_at: Date | null; // TIMESTAMP WITH TIME ZONE
  idempotency_key: string; // VARCHAR(128)
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
