// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `commerce.order_discounts`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface CommerceOrderDiscountsRow {
  order_id: string; // UUID
  order_item_id: string | null; // UUID
  promotion_id: string | null; // UUID
  discount_type: string; // VARCHAR(64)
  amount: string; // NUMERIC(14, 2)
  metadata_json: unknown; // JSONB
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
