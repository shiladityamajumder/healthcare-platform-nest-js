// * Describes the raw PostgreSQL row shape for the procurement.goods_receipt_items table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `procurement.goods_receipt_items`. */
export interface ProcurementGoodsReceiptItemsRow {
  goods_receipt_id: string; // UUID
  purchase_order_item_id: string; // UUID
  batch_number: string; // VARCHAR(128)
  manufactured_at: string | null; // DATE
  expiry_date: string; // DATE
  received_qty: string; // NUMERIC(16, 3)
  accepted_qty: string; // NUMERIC(16, 3)
  rejected_qty: string; // NUMERIC(16, 3)
  mrp: string; // NUMERIC(14, 2)
  unit_cost: string; // NUMERIC(14, 2)
  quality_status: string; // VARCHAR(32)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
