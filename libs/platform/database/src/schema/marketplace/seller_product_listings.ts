/** Raw PostgreSQL row shape for `marketplace.seller_product_listings`. */
export interface MarketplaceSellerProductListingsRow {
  seller_id: string; // UUID
  product_id: string; // UUID
  variant_id: string | null; // UUID
  seller_sku: string | null; // VARCHAR(128)
  status: string; // VARCHAR(32)
  fulfillment_mode: string; // VARCHAR(32)
  lead_time_minutes: number; // INTEGER
  metadata_json: unknown; // JSONB
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  is_deleted: boolean; // BOOLEAN
  deleted_at: Date | null; // TIMESTAMP WITH TIME ZONE
  deleted_by: string | null; // UUID
  row_version: string; // BIGINT
}
