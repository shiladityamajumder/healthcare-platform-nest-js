// * Describes the raw PostgreSQL row shape for the fulfillment.pick_task_items table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `fulfillment.pick_task_items`. */
export interface FulfillmentPickTaskItemsRow {
  pick_task_id: string; // UUID
  order_item_id: string; // UUID
  lot_id: string; // UUID
  bin_id: string; // UUID
  required_qty: string; // NUMERIC(12, 3)
  picked_qty: string; // NUMERIC(12, 3)
  short_pick_reason: string | null; // VARCHAR(64)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
