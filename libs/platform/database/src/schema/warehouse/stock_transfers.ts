// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `warehouse.stock_transfers`. */
// * Describe the database row shape consumed by repositories and transaction code.
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
