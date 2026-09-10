/** Raw PostgreSQL row shape for `marketplace.seller_locations`. */
export interface MarketplaceSellerLocationsRow {
  seller_id: string; // UUID
  location_id: string; // UUID
  warehouse_id: string | null; // UUID
  fulfillment_mode: string; // VARCHAR(32)
  is_active: boolean; // BOOLEAN
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
