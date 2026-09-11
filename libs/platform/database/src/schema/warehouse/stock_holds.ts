// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `warehouse.stock_holds`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface WarehouseStockHoldsRow {
  warehouse_id: string; // UUID
  bin_id: string | null; // UUID
  lot_id: string; // UUID
  quantity: string; // NUMERIC(16, 3)
  reason_code: string; // VARCHAR(64)
  status: string; // VARCHAR(32)
  released_at: Date | null; // TIMESTAMP WITH TIME ZONE
  released_by_user_id: string | null; // UUID
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
