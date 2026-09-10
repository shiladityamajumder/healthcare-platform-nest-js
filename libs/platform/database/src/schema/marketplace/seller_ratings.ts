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
