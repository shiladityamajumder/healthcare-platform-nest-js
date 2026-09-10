/** Raw PostgreSQL row shape for `warehouse.inventory_adjustment_items`. */
export interface WarehouseInventoryAdjustmentItemsRow {
  adjustment_id: string; // UUID
  bin_id: string; // UUID
  lot_id: string; // UUID
  quantity_delta: string; // NUMERIC(16, 3)
  notes: string | null; // TEXT
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
