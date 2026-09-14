// * Describes the raw PostgreSQL row shape for the warehouse.stock_transfers table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `warehouse.stock_transfers`. */
export interface WarehouseStockTransfersRow {
  transfer_number: string; // VARCHAR(64)
  source_warehouse_id: string; // UUID
  destination_warehouse_id: string; // UUID
  status: string; // VARCHAR(32)
  requested_by_user_id: string; // UUID
  approved_by_user_id: string | null; // UUID
  dispatched_at: Date | null; // TIMESTAMP WITH TIME ZONE
  received_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
