// * Describes the raw PostgreSQL row shape for the marketplace.seller_ratings table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `marketplace.seller_ratings`. */
export interface MarketplaceSellerRatingsRow {
  seller_id: string; // UUID
  order_id: string; // UUID
  user_id: string; // UUID
  rating: number; // INTEGER
  review_text: string | null; // TEXT
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
