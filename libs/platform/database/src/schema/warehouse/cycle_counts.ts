// * Describes the raw PostgreSQL row shape for the warehouse.cycle_counts table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `warehouse.cycle_counts`. */
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
