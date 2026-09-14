// * Describes the raw PostgreSQL row shape for the commerce.order_charges table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `commerce.order_charges`. */
export interface CommerceOrderChargesRow {
  order_id: string; // UUID
  charge_type: string; // VARCHAR(64)
  description: string | null; // VARCHAR(255)
  amount: string; // NUMERIC(14, 2)
  tax_amount: string; // NUMERIC(14, 2)
  metadata_json: unknown; // JSONB
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
