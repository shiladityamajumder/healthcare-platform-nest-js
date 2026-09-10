/** Raw PostgreSQL row shape for `commerce.return_items`. */
export interface CommerceReturnItemsRow {
  return_id: string; // UUID
  order_item_id: string; // UUID
  quantity: string; // NUMERIC(12, 3)
  condition: string | null; // VARCHAR(32)
  resolution: string; // VARCHAR(32)
  approved_qty: string | null; // NUMERIC(12, 3)
  inspection_notes: string | null; // TEXT
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
