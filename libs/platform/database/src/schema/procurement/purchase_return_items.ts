/** Raw PostgreSQL row shape for `procurement.purchase_return_items`. */
export interface ProcurementPurchaseReturnItemsRow {
  purchase_return_id: string; // UUID
  lot_id: string; // UUID
  quantity: string; // NUMERIC(16, 3)
  reason_code: string; // VARCHAR(64)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
