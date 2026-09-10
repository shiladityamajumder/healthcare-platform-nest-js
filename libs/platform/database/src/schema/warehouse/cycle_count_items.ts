/** Raw PostgreSQL row shape for `warehouse.cycle_count_items`. */
export interface WarehouseCycleCountItemsRow {
  cycle_count_id: string; // UUID
  bin_id: string; // UUID
  lot_id: string; // UUID
  system_qty: string; // NUMERIC(16, 3)
  counted_qty: string | null; // NUMERIC(16, 3)
  variance_qty: string | null; // NUMERIC(16, 3)
  reason_code: string | null; // VARCHAR(64)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
