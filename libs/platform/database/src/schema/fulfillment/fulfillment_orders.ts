// Linked with: database repositories, migrations, and transaction code.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Raw PostgreSQL row shape for `fulfillment.fulfillment_orders`. */
// Describe the database row shape consumed by repositories and transaction code.
export interface FulfillmentFulfillmentOrdersRow {
  fulfillment_number: string; // VARCHAR(64)
  order_id: string; // UUID
  order_group_id: string | null; // UUID
  warehouse_id: string; // UUID
  seller_id: string | null; // UUID
  status: string; // VARCHAR(16)
  priority: number; // INTEGER
  due_at: Date | null; // TIMESTAMP WITH TIME ZONE
  wave_id: string | null; // UUID
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
