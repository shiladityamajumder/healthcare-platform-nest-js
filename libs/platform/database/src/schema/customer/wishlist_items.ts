// * Describes the raw PostgreSQL row shape for the customer.wishlist_items table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `customer.wishlist_items`. */
export interface CustomerWishlistItemsRow {
  wishlist_id: string; // UUID
  product_id: string; // UUID
  notes: string | null; // VARCHAR(255)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
