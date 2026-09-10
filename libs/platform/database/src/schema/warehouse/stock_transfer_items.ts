/** Raw PostgreSQL row shape for `warehouse.stock_transfer_items`. */
export interface WarehouseStockTransferItemsRow {
  transfer_id: string; // UUID
  lot_id: string; // UUID
  requested_qty: string; // NUMERIC(16, 3)
  dispatched_qty: string; // NUMERIC(16, 3)
  received_qty: string; // NUMERIC(16, 3)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
