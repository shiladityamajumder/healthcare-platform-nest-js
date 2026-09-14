// * Describes the raw PostgreSQL row shape for the warehouse.inventory_lots table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `warehouse.inventory_lots`. */
export interface WarehouseInventoryLotsRow {
  warehouse_id: string; // UUID
  product_id: string; // UUID
  variant_id: string | null; // UUID
  supplier_id: string | null; // UUID
  goods_receipt_item_id: string | null; // UUID
  batch_number: string; // VARCHAR(128)
  manufactured_at: string | null; // DATE
  expires_at: string; // DATE
  purchase_cost: string | null; // NUMERIC(14, 2)
  mrp: string; // NUMERIC(14, 2)
  quality_status: string; // VARCHAR(16)
  recall_status: string; // VARCHAR(32)
  received_at: Date | null; // TIMESTAMP WITH TIME ZONE
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
