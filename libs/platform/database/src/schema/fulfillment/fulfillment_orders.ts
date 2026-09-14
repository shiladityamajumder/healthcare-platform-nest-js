// * Describes the raw PostgreSQL row shape for the fulfillment.fulfillment_orders table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `fulfillment.fulfillment_orders`. */
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
