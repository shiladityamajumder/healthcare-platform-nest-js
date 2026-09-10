// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `pricing.pricing_evaluations`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface PricingPricingEvaluationsRow {
  reference_type: string; // VARCHAR(32)
  reference_id: string; // UUID
  user_id: string | null; // UUID
  request_payload: unknown; // JSONB
  response_snapshot: unknown; // JSONB
  rule_version: string; // VARCHAR(64)
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
