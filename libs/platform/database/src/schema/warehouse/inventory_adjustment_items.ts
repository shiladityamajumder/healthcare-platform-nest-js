// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `warehouse.inventory_adjustment_items`. */
// Describe the database row shape consumed by repositories and transaction code.
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
