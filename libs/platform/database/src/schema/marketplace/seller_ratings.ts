// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `marketplace.seller_ratings`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface MarketplaceSellerRatingsRow {
  seller_id: string; // UUID
  order_id: string; // UUID
  user_id: string; // UUID
  rating: number; // INTEGER
  review_text: string | null; // TEXT
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
