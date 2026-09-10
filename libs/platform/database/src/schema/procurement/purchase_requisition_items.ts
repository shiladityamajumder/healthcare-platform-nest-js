/** Raw PostgreSQL row shape for `procurement.purchase_requisition_items`. */
export interface ProcurementPurchaseRequisitionItemsRow {
  requisition_id: string; // UUID
  product_id: string; // UUID
  variant_id: string | null; // UUID
  requested_qty: string; // NUMERIC(16, 3)
  approved_qty: string | null; // NUMERIC(16, 3)
  reason: string | null; // VARCHAR(255)
  id: string; // UUID
  updated_at: Date; // TIMESTAMP WITH TIME ZONE
  created_at: Date; // TIMESTAMP WITH TIME ZONE
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
  row_version: string; // BIGINT
}
