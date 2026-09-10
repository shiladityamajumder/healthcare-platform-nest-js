// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `warehouse.cycle_counts`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface WarehouseCycleCountsRow {
  warehouse_id: string; // UUID
  bin_id: string | null; // UUID
  status: string; // VARCHAR(32)
  scheduled_at: Date; // TIMESTAMP WITH TIME ZONE
  started_at: Date | null; // TIMESTAMP WITH TIME ZONE
  completed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  assigned_to_user_id: string | null; // UUID
  count_mode: string; // VARCHAR(32)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
