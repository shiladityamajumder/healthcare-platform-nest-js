// * Describes the raw PostgreSQL row shape for the procurement.purchase_requisition_items table.
// * Used by SQL repositories to type query results from the externally managed database.
// ! Keep property names and types synchronized with the corresponding database table.
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
