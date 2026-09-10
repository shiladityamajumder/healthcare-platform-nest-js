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
