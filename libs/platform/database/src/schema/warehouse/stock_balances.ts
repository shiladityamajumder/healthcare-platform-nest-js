// * Describes the raw PostgreSQL row shape for the warehouse.stock_balances table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
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
