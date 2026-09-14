// * Describes the raw PostgreSQL row shape for the procurement.goods_receipts table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
/** Raw PostgreSQL row shape for `procurement.goods_receipts`. */
export interface ProcurementGoodsReceiptsRow {
  grn_number: string; // VARCHAR(64)
  purchase_order_id: string; // UUID
  warehouse_id: string; // UUID
  supplier_invoice_id: string | null; // UUID
  status: string; // VARCHAR(32)
  received_at: Date | null; // TIMESTAMP WITH TIME ZONE
  received_by_user_id: string; // UUID
  vehicle_number: string | null; // VARCHAR(64)
  delivery_challan_number: string | null; // VARCHAR(128)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
