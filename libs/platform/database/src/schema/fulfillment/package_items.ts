/** Raw PostgreSQL row shape for `fulfillment.package_items`. */
export interface FulfillmentPackageItemsRow {
  package_id: string; // UUID
  order_item_id: string; // UUID
  lot_id: string; // UUID
  quantity: string; // NUMERIC(12, 3)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
