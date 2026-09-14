// * Describes the raw PostgreSQL row shape for the fulfillment.pick_tasks table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `fulfillment.pick_tasks`. */
export interface FulfillmentPickTasksRow {
  fulfillment_order_id: string; // UUID
  wave_id: string | null; // UUID
  assigned_to_user_id: string | null; // UUID
  status: string; // VARCHAR(32)
  started_at: Date | null; // TIMESTAMP WITH TIME ZONE
  completed_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
