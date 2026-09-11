// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `warehouse.stock_ledger`. */
// * Describe the database row shape consumed by repositories and transaction code.
export interface WarehouseStockLedgerRow {
  warehouse_id: string; // UUID
  bin_id: string | null; // UUID
  lot_id: string; // UUID
  movement_type: string; // VARCHAR(32)
  quantity: string; // NUMERIC(16, 3)
  reference_type: string; // VARCHAR(64)
  reference_id: string; // UUID
  idempotency_key: string; // VARCHAR(128)
  occurred_at: Date; // TIMESTAMP WITH TIME ZONE
  actor_user_id: string | null; // UUID
  notes: string | null; // TEXT
  id: string; // UUID
  created_at: Date; // TIMESTAMP WITH TIME ZONE
}
