// * Describes the raw PostgreSQL row shape for the commerce.cart_items table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `commerce.cart_items`. */
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
