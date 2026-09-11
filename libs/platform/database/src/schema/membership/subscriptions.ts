// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `membership.subscriptions`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface MembershipSubscriptionsRow {
  subscription_number: string; // VARCHAR(64)
  user_id: string; // UUID
  plan_id: string; // UUID
  status: string; // VARCHAR(16)
  starts_at: Date; // TIMESTAMP WITH TIME ZONE
  ends_at: Date; // TIMESTAMP WITH TIME ZONE
  auto_renew: boolean; // BOOLEAN
  payment_method_id: string | null; // UUID
  cancelled_at: Date | null; // TIMESTAMP WITH TIME ZONE
  cancellation_reason: string | null; // VARCHAR(255)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
