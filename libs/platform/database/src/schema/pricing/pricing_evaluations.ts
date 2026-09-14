// * Describes the raw PostgreSQL row shape for the pricing.pricing_evaluations table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `pricing.pricing_evaluations`. */
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
