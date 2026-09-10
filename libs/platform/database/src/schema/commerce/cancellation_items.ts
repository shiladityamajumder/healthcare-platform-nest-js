/** Raw PostgreSQL row shape for `commerce.cancellation_items`. */
export interface CommerceCancellationItemsRow {
  cancellation_id: string; // UUID
  order_item_id: string; // UUID
  quantity: string; // NUMERIC(12, 3)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
