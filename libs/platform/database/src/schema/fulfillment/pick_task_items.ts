// * Linked with: database repositories, migrations, and transaction code.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `fulfillment.pick_task_items`. */
// * Describe the database row shape consumed by repositories and transaction code.
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
