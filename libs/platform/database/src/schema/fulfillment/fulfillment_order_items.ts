/** Raw PostgreSQL row shape for `fulfillment.fulfillment_order_items`. */
export interface FulfillmentFulfillmentOrderItemsRow {
  fulfillment_order_id: string; // UUID
  order_item_id: string; // UUID
  required_qty: string; // NUMERIC(12, 3)
  fulfilled_qty: string; // NUMERIC(12, 3)
  status: string; // VARCHAR(32)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
