// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `commerce.cart_items`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface CommerceCartItemsRow {
  cart_id: string; // UUID
  product_id: string; // UUID
  variant_id: string | null; // UUID
  seller_id: string | null; // UUID
  quantity: string; // NUMERIC(12, 3)
  unit_price_snapshot: string; // NUMERIC(14, 2)
  prescription_id: string | null; // UUID
  fulfillment_preference: string | null; // VARCHAR(32)
  metadata_json: unknown; // JSONB
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
