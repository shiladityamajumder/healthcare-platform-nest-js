/** Raw PostgreSQL row shape for `commerce.order_discounts`. */
export interface CommerceOrderDiscountsRow {
  order_id: string; // UUID
  order_item_id: string | null; // UUID
  promotion_id: string | null; // UUID
  discount_type: string; // VARCHAR(64)
  amount: string; // NUMERIC(14, 2)
  metadata_json: unknown; // JSONB
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
