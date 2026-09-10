/** Raw PostgreSQL row shape for `pricing.product_prices`. */
export interface PricingProductPricesRow {
  price_book_id: string; // UUID
  product_id: string; // UUID
  variant_id: string | null; // UUID
  mrp: string; // NUMERIC(14, 2)
  selling_price: string; // NUMERIC(14, 2)
  cost_price: string | null; // NUMERIC(14, 2)
  valid_from: Date; // TIMESTAMP WITH TIME ZONE
  valid_until: Date | null; // TIMESTAMP WITH TIME ZONE
  source: string; // VARCHAR(32)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
