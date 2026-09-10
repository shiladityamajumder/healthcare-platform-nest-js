/** Raw PostgreSQL row shape for `marketplace.seller_service_levels`. */
export interface MarketplaceSellerServiceLevelsRow {
  seller_id: string; // UUID
  metric_date: Date; // TIMESTAMP WITH TIME ZONE
  fill_rate: string; // NUMERIC(7, 4)
  on_time_rate: string; // NUMERIC(7, 4)
  cancellation_rate: string; // NUMERIC(7, 4)
  quality_score: string | null; // NUMERIC(7, 4)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
