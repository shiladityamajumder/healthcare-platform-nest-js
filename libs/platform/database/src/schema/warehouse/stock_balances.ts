/** Raw PostgreSQL row shape for `warehouse.stock_balances`. */
export interface WarehouseStockBalancesRow {
  warehouse_id: string; // UUID
  bin_id: string; // UUID
  lot_id: string; // UUID
  on_hand_qty: string; // NUMERIC(16, 3)
  reserved_qty: string; // NUMERIC(16, 3)
  damaged_qty: string; // NUMERIC(16, 3)
  quarantined_qty: string; // NUMERIC(16, 3)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
