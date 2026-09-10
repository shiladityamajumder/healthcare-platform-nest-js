// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `membership.benefit_usage`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface MembershipBenefitUsageRow {
  subscription_id: string; // UUID
  benefit_id: string; // UUID
  reference_type: string; // VARCHAR(32)
  reference_id: string; // UUID
  quantity: string; // NUMERIC(12, 3)
  amount_saved: string; // NUMERIC(14, 2)
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
